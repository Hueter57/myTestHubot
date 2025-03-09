// Description:
//
// Commands:
//

const WRITER_REGEXP = /@[a-zA-Z0-9_-]+/g;

import hubot from "hubot";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
const myLogChannel = {
  channelID: "06a78616-4de5-4195-826d-ad834912e215",
} as any;

type CrowiInfo = {
  host: string;
  pagePath: string;
  token: string;
};

type traQInfo = {
  channelId: string;
  logChannelId: string;
  buriChannelPath: string;
  reviewChannelPath: string;
  traqBotToken: string;
};

type BlogRelayInfo = {
  tag: string;
  title: string;
  startDate: string;
};

type InitResult = {
  crowi: CrowiInfo;
  traQ: traQInfo;
  blogRelay: BlogRelayInfo;
  noticeMessage: string;
};

type CrowiGetPageResponse = {
  page: {
    revision: {
      body: string;
    };
  };
  ok: boolean;
};

console.log("testest");
module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getCrowi$/i, async (res: hubot.Response): Promise<void> => {
    const v = init();
    if (v === null) {
      console.log("init failed");
      return;
    }
    const { crowi, traQ, blogRelay, noticeMessage } = v;

    try {
      const pageBody = await getCrowiPageBody(crowi);
      if (pageBody === "") {
        console.log("failed get crowi page body");
        res.send("failed get crowi page body");
        return;
      }
      const schedules = extractSchedule(pageBody);
      const dateDiff = calcDateDiff(blogRelay);
      const messageHead =
        dateDiff < 0
          ? getBeforeMessage(blogRelay.title, -dateDiff)
          : getDuringMessage(blogRelay.title, dateDiff, schedules);

      // res.send(myLogChannel, messageHead + noticeMessage);
      console.log(messageHead + noticeMessage);
      const logMessage = schedulesToCalendar(blogRelay, schedules);
      // res.send(myLogChannel, logMessage);
      console.log(logMessage);
    } catch (error) {
      console.error("Error fetching Crowi page:", error);
    }
  });
};

function init(): InitResult | null {
  const crowiHost = process.env.CROWI_HOST;
  const crowiPath = process.env.CROWI_PAGE_PATH;
  const crowiToken = process.env.CROWI_ACCESS_TOKEN;
  if (
    crowiHost === undefined ||
    crowiPath === undefined ||
    crowiToken === undefined
  ) {
    return null;
  }
  const traQChannelId = process.env.TRAQ_CHANNEL_ID;
  const traQLogChannelId = process.env.TRAQ_LOG_CHANNEL_ID;
  const traQBuriChannelPath = process.env.TRAQ_BURI_CHANNEL_PATH;
  const traQReviewChannelPath = process.env.TRAQ_REVIEW_CHANNEL_PATH;
  const traQBotToken = process.env.TRAQ_BOT_ACCESS_TOKEN;
  if (
    traQChannelId === undefined ||
    traQLogChannelId === undefined ||
    traQBuriChannelPath === undefined ||
    traQReviewChannelPath === undefined ||
    traQBotToken === undefined
  ) {
    return null;
  }
  const blogRelayTag = process.env.TAG;
  const blogRelayTitle = process.env.TITLE;
  const blogRelayStartDate = process.env.START_DATE;
  if (
    blogRelayTag === undefined ||
    blogRelayTitle === undefined ||
    blogRelayStartDate === undefined
  ) {
    return null;
  }
  const url = `https://${crowiHost}${crowiPath}`;
  const noticeMessage = `
## 注意事項
- \`${blogRelayTag}\`のタグをつけてください
- 記事の初めにブログリレー何日目の記事かを明記してください
- 記事の最後に次の日の担当者を紹介してください
- **post imageを設定して**ください
- わからないことがあれば気軽に ${traQBuriChannelPath} まで
- 記事内容の添削や相談は、気軽に ${traQReviewChannelPath} へ
- 詳細は ${url}`;
  return {
    crowi: {
      host: crowiHost,
      pagePath: crowiPath,
      token: crowiToken,
    },
    traQ: {
      channelId: traQChannelId,
      logChannelId: traQLogChannelId,
      buriChannelPath: traQBuriChannelPath,
      reviewChannelPath: traQReviewChannelPath,
      traqBotToken: traQBotToken,
    },
    blogRelay: {
      tag: blogRelayTag,
      title: blogRelayTitle,
      startDate: blogRelayStartDate,
    },
    noticeMessage,
  };
}

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
function calcDateDiff({ startDate }: BlogRelayInfo): number {
  const date = new Date(startDate);
  console.log("startDate", date);
  console.log("day", date.getDay(), "month", date.getMonth(), "hour", date.getHours(), "minute", date.getMinutes());
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

function schedulesToCalendar(
  blogRelayInfo: BlogRelayInfo,
  schedules: Schedule[]
): string {
  const weeks: Array<Array<[Date, Schedule[]]>> = [];
  let i = 0;
  const scheduleLength = schedules.length;
  const startDate = new Date(blogRelayInfo.startDate);
  const calendarStartDate = dateOffset(startDate, -startDate.getDay());
  while (i < scheduleLength) {
    const week: Array<[Date, Schedule[]]> = [];
    const weekStartDate = dateOffset(calendarStartDate, weeks.length * 7);
    for (let weekDay = 0; weekDay < 7; weekDay++) {
      const day: Schedule[] = [];
      const date = dateOffset(weekStartDate, weekDay);
      while (
        i < scheduleLength &&
        actualDateOfSchedule(blogRelayInfo, schedules[i]).getDay() === weekDay
      ) {
        day.push(schedules[i]);
        i++;
      }
      week.push([date, day]);
    }
    weeks.push(week);
  }
  const calendarBody = weeks
    .map((week) =>
      week
        .map((dayInfo) => {
          const date = dayInfo[0];
          const day = dayInfo[1];
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
          const dayStr = day
            .map((schedule) => scheduleToStringInCalendar(schedule))
            .join(" ");
          return `**${dateStr}**${dayStr}`;
        })
        .join(" | ")
    )
    .join("\n");
  return `\
:day0_sunday: | :day1_monday: | :day2_tuesday: | :day3_wednesday: | :day4_thursday: | :day5_friday: | :day6_saturday:
--- | --- | --- | --- | --- | --- | ---
${calendarBody}`;
}

function dateOffset(date: Date, offset: number): Date {
  const dateMs = date.getTime();
  const offsetMs = offset * 24 * 60 * 60 * 1000;
  return new Date(dateMs + offsetMs);
}

function actualDateOfSchedule(
  { startDate }: BlogRelayInfo,
  schedule: Schedule
): Date {
  // UNIXタイムスタンプ
  const startDateParsed = new Date(startDate);
  // 経過日数のms
  const offset = schedule.day - 1;
  return dateOffset(startDateParsed, offset);
}

function scheduleToStringInCalendar(schedule: Schedule): string {
  const writerIcons = Array.from(schedule.writer.matchAll(WRITER_REGEXP))
    .map((match) => `:${match[0]}:`)
    .join("");
  return writerIcons;
}
