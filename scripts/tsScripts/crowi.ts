// Description:
//
// Commands:
//

const WRITER_REGEXP = /@[a-zA-Z0-9_-]+/g;

import hubot from "hubot";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

type CrowiInfo = {
  host: string;
  pagePath: string;
  token: string;
};

type CrowiGetPageResponse = {
  page: {
    revision: {
      body: string;
    };
  };
  ok: boolean;
};

module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getCrowi$/i, async (res: hubot.Response): Promise<void> => {
    const crowiPagePath = process.env.CROWI_PAGE_PATH;
    const crowiToken = process.env.CROWI_ACCESS_TOKEN;
    const blogTitle = process.env.TITLE;
    const startDate = process.env.START_DATE;
    const noticeMessage = `
## 注意事項
- \`po\`のタグをつけてください
- 記事の初めにブログリレー何日目の記事かを明記してください
- 記事の最後に次の日の担当者を紹介してください
- **post imageを設定して**ください
- わからないことがあれば気軽に ore まで
- 記事内容の添削や相談は、気軽に kare へ
- 詳細は nai`;
    if (
      crowiPagePath === undefined ||
      crowiToken === undefined ||
      blogTitle === undefined ||
      startDate === undefined
    ) {
      res.send("crowi envs are undefined");
      console.log("crowi envs are undefined");
      return;
    }

    try {
      const pageBody = await getCrowiPageBody({
        host: "wiki.trap.jp",
        pagePath: crowiPagePath,
        token: crowiToken,
      } as CrowiInfo);
      if (pageBody === "") {
        console.log("failed get crowi page body");
        res.send("failed get crowi page body");
        return;
      }
      const schedules = extractSchedule(pageBody);
      const dateDiff = calcDateDiff(startDate);
      const messageHead =
        dateDiff < 0
          ? getBeforeMessage(blogTitle, -dateDiff)
          : getDuringMessage(blogTitle, dateDiff, schedules);

      // res.send(messageHead + noticeMessage)
      console.log(messageHead + noticeMessage);
    } catch (error) {
      console.error("Error fetching Crowi page:", error);
    }
  });
};

async function getCrowiPageBody({
  host,
  pagePath,
  token,
}: CrowiInfo): Promise<string> {
  const encodedPath = encodeURI(pagePath);
  const options: AxiosRequestConfig = {
    url: `https://${host}/_api/pages.get?access_token=${token}&path=${encodedPath}`,
    method: "GET",
  };
  var body: string = "";
  await axios(options)
    .then((res: AxiosResponse<CrowiGetPageResponse>) => {
      const { data, status } = res;
      console.log("status:" + status);
      if (data.ok) {
        body = data.page.revision.body as string;
      } else {
        console.log("data.ok is false");
      }
    })
    .catch((e: AxiosError<{ error: string }>) => {
      console.log(e.message);
    });
  return body;
}

// START_DATEとの差分を取得する
// now - date
function calcDateDiff(startDate: string): number {
  const date = new Date(startDate);
  const dateUtcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const now = new Date();
  const nowUtcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const diff = nowUtcTime - dateUtcTime;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

type Schedule = {
  date: string;
  day: number;
  writer: string;
  summary: string;
};

function extractScheduleStr(pageBody: string): string {
  const lines = pageBody.split(/\r\n|\r|\n/);
  const startIndex = lines.findIndex((l: string): boolean =>
    /^\|\s*日付.*/.test(l)
  );
  let table = "";
  for (let i = startIndex; i < lines.length; ++i) {
    const l = lines[i];
    if (/^\s*\|.*/.test(l)) {
      table += l + "\n";
    } else {
      break;
    }
  }
  return table;
}

function extractSchedule(pageBody: string): Schedule[] {
  const tableStr = extractScheduleStr(pageBody);
  const lines = tableStr
    .split("\n")
    .filter((l: string): boolean => l.startsWith("|"));
  const table: Schedule[] = [];
  for (let i = 2; i < lines.length; ++i) {
    // | 日付 | 日目 | 担当者 | タイトル(内容) |
    const cells = lines[i]
      .split("|")
      .slice(1, -1)
      .map((c: string): string => c.trim());
    const s: Schedule = {
      date: cells[0],
      day: parseInt(cells[1]),
      writer: cells[2],
      summary: cells[3],
    };
    if (s.writer.length === 0) {
      continue;
    }
    if (s.date === "同上") {
      s.date = table[table.length - 1].date;
    }
    table.push(s);
  }
  return table;
}

// ブログリレー期間前のメッセージを取得する関数
// diff > 0
function getBeforeMessage(title: string, diff: number): string {
  return `# ${title}まであと ${diff}日`;
}

// ブログリレー期間中のメッセージを取得する関数
// diff >= 0
function getDuringMessage(
  title: string,
  diff: number,
  schedules: Schedule[]
): string {
  const d = diff + 1;
  const ss = schedules.filter(
    (s: Schedule): boolean => d <= s.day && s.day <= d + 1
  );
  if (ss.length > 0) {
    return `# ${title} ${d}日目\n${schedulesToTable(ss)}`;
  }
  return `# ${title} ${d}日目\n担当者はいません`;
}

function scheduleToString(s: Schedule): string {
  const writers = Array.from(s.writer.matchAll(WRITER_REGEXP))
    .map((match) => match[0])
    .join(", ");
  return `| ${s.date} | ${s.day} | ${writers} | ${s.summary} |`;
}

function schedulesToTable(schedules: Schedule[]): string {
  return `\
| 日付 | 日目 | 担当者 | タイトル(内容) |
| :-: | :-: | :-: | :-- |
${schedules.map(scheduleToString).join("\n")}`;
}
