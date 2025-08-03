// Description:
//
// Commands:
//

import hubot from "hubot";


module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getValue (.+)$/i, async (res: hubot.Response): Promise<void> => {
    const value = res.match.join(", ");
    res.send(`The value is: ${value}`);
  });
}