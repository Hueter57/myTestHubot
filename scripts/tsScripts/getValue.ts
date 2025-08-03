// Description:
//
// Commands:
//

import hubot from "hubot";


module.exports = (robot: hubot.Robot): void => {
  robot.hear(/getValue (.+)$/i, async (res: hubot.Response): Promise<void> => {
    const value = res.match.join(", ");
    const num = res.match[2].index;
    const input = res.match[3];
    res.send(`value : ${value}, index: ${num}, input: ${input}`);
  });

  robot.hear(/getValues ([^,]+),([^,]+)$/i, async (res: hubot.Response): Promise<void> => {
    const value = res.match.join(", ");
    const num = res.match[2].index;
    const input = res.match[3];
    res.send(`value : ${value}, index: ${num}, input: ${input}`);
  });
}