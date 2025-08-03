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
    const value = res.match.join(", ").split(", ");
    const num = res.match[2];
    const input = res.match[3];
    res.send(`value : ${value} value1 : ${res.match[1]} index: ${num} input: ${input}`);
  });
}