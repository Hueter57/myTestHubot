// Description:
//
// Commands:
//

const WRITER_REGEXP = /@[a-zA-Z0-9_-]+/g;

const axios = require("axios");

import hubot from "hubot";

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
    console.log(body);
  });
};

function getCrowiPageBody({ host, pagePath, token }: CrowiInfo): string {
  const encodedPath = encodeURI(pagePath);
  const url = `https://${host}/_api/pages.get?access_token=${token}&path=${encodedPath}`;
  const res = axios.get(url);
  const payload = JSON.parse(res.getContentText());
  // eslint-disable-next-line @typescript-eslint/dot-notation
  return payload["page"]["revision"]["body"] as string;
}
