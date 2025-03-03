// Description:
//
// Commands:
//

import hubot from "hubot";

import { Apis, Configuration } from "@traptitech/traq";

const api = new Apis(
  new Configuration({
    accessToken: process.env.HUBOT_TRAQ_ACCESS_TOKEN,
  })
);

const axios = require("axios");

module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getAllStamp$/i, async (res: hubot.Response) => {
    try {
      api.getStamps().then((response) => {
        if (response.statusText === "OK") {
          res.send("get data");
          response.data.forEach((stampData) => {
            console.log(stampData.name + ":" + stampData.id);
          });
        } else {
          res.send(response.status.toString());
        }
      });
    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });

  robot.hear(/getStamp (.*)$/, async (res: hubot.Response) => {
    const name = res.match[1];
    try {
      api.getStamps().then((response) => {
        if (response.statusText === "OK") {
          res.send(`get data
start search`);
          response.data.some((stampData) => {
            if (stampData.name == name) {
              res.send(":" + stampData.name + ": : " + stampData.id);
              return true;
            }
          });
        } else {
          res.send(response.status.toString());
        }
      });
    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });
};
