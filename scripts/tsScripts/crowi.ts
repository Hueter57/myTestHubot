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
    if (crowiPagePath === undefined || crowiToken === undefined) {
      res.send("crowi envs are undefined");
      console.log("crowi envs are undefined");
      return;
    }

    try {
      const body = await getCrowiPageBody({
        host: "wiki.trap.jp",
        pagePath: crowiPagePath,
        token: crowiToken,
      } as CrowiInfo);

      console.log("aaaaaa");
      console.log(body);
      if (body !== "") {
        res.send(body);
      }
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
      console.log("data:" + data);
      console.log("data:" + data["page"]);
      console.log(data.page);
      console.log(data);
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
