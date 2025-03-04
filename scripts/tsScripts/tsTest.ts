// Description:
//
// Commands:
//

import hubot from "hubot";

module.exports = (robot: hubot.Robot): void => {
  robot.hear(/ping$/i, async (res: hubot.Response): Promise<void> => {
    await res.send("pong");
  }); 
  robot.hear(/hoge$/i, async (res: hubot.Response): Promise<void> => {
    await res.reply("fuga");
  });
};
