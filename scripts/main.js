// Commands:
//  ぬるぽ - ガッ！
//

"use strict";

module.exports = async robot => {
  // "@botName hoge"を受け取ったら"@senderName fuga"を送り返す
  robot.respond(/hoge$/i, res => {
    res.reply("fuga");
  });
  robot.respond(/ping$/i, res => {
    res.reply("pong");
  });
};