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

module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getCrowi$/i, async (res: hubot.Response): Promise<void> => {
    const crowiPagePath = process.env.CROWI_PAGE_PATH;
    const crowiToken = process.env.CROWI_ACCESS_TOKEN;
    if (crowiPagePath === undefined || crowiToken === undefined) {
      res.send("crowi envs are undefined");
      console.log("crowi envs are undefined");
      return;
    }
    const body = getCrowiPageBody({
      host: "wiki.trap.jp",
      pagePath: crowiPagePath,
      token: crowiToken,
    });
    res.send(body);
    console.log(body);
  });
};

function getCrowiPageBody({ host, pagePath, token }: CrowiInfo): any {
  const encodedPath = encodeURI(pagePath);
  const options: AxiosRequestConfig = {
    url: `https://${host}/_api/pages.get?access_token=${token}&path=${encodedPath}`,
    method: "GET",
  };
  axios(options)
    .then((res: AxiosResponse<string>) => {
      const { data, status } = res;
      console.log(data);
      console.log(data.toString());
      console.log(status.toString());
      console.log(status);
      return data;
    })
    .catch((e: AxiosError<{ error: string }>) => {
      console.log(e.message);
      return e;
    });
  // const payload = JSON.parse(res.getContentText());
  // eslint-disable-next-line @typescript-eslint/dot-notation
}
