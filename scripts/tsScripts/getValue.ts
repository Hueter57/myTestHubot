// Description:
//
// Commands:
//

import hubot from "hubot";


module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getValue (.+)$/i, async (res: hubot.Response): Promise<void> => {
    const value = res.match.join(", ");
    res.send(`value : ${value}`);
  });

  robot.hear(/getValues ([^,]+),([^,]+)$/i, async (res: hubot.Response): Promise<void> => {
    const value = res.match[0];
    const value1 = res.match[1];
    const value2 = res.match[2];
    res.send(`value : ${value} value1 : ${value1} value2 : ${value2}`);
  });
}