'use strict'

// Description:
//
// Commands:
//


module.exports = async robot => {
  robot.respond(/hoge$/i, res => {
    res.reply("fuga");
  });

  robot.hear(/stamp/, res => {
    res.send(
      "stamp", {
      type: "stamp",
      name: "done-nya"
    });
  });
}