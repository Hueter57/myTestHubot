// Description:
//
// Commands:
//

import hubot from "hubot";

import { Apis, Configuration } from "@traptitech/traq";

const api = new Apis(new Configuration({
  accessToken: process.env.HUBOT_TRAQ_ACCESS_TOKEN
}));


module.exports = (robot: hubot.Robot): void => {
  robot.hear(/ping$/i, async (res: hubot.Response): Promise<void> => {
    await res.send("pong");
  }); 
  robot.hear(/hoge$/i, async (res: hubot.Response): Promise<void> => {
    await res.reply("fuga");
    api.getStamps().then(res => {
      console.log(res.data.toString());
    });
  });
};
