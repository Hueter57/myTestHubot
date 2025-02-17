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
    try {
      res.send({
        type: "stamp",
        name: "waku"
      });
    } catch (error) {
      res.send("error");
      res.send(error);
    }
  });
}