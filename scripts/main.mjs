'use strict'

// Description:
//
// Commands:
//

export default async robot => {
  robot.respond(/hoge$/i, res => {
    res.reply("fuga");
  });
  robot.respond(/ping$/i, res => {
    res.reply("pong");
  });
}
