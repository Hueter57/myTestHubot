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
  robot.hear(/send_Hueter$/, res => {
    res.send(
      {
        type: "stamp",
        name: "done-nya"
      }, {
        type: "stamp",
        name: "doya-nya"
      }, {
        type: "stamp",
        name: "hyun-nya"
      }
    );
    robot.send({ userID: "236fe853-f208-477b-9f1f-0f42fe614d3b" }, ":choo-choo-train-nya:");
  });
  robot.respond(/send$/i, res => {
    robot.send({ channelID: "06a78616-4de5-4195-826d-ad834912e215" }, ":good-nya:");
  });
}
