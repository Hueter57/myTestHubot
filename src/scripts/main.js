const corn = require("node-cron");

module.exports = robot => {

  robot.send({ channelID: "06a78616-4de5-4195-826d-ad834912e215" }, ":done-nya:");

  robot.hear(/send_Hueter$/, res => {
    robot.send({ userID: "236fe853-f208-477b-9f1f-0f42fe614d3b" }, ":choo-choo-train-nya:");
  });
  robot.respond(/send$/i, res => {
    robot.send({ channelID: "06a78616-4de5-4195-826d-ad834912e215" }, ":good-nya:");
  });

  robot.hear(/stamp2/, res => {
    res.send({
      type: "stamp",
      name: "done-nya"
    });
    robot.send({ channelID: "06a78616-4de5-4195-826d-ad834912e215" }, ":good-nya:");
  });
  robot.hear(/stamps/, res => {
    res.send({
      type: "stamp",
      name: "done-nya"
    }, {
      type: "stamp",
      name: "doya-nya"
    }, {
      type: "stamp",
      name: "hyun-nya"
    });
  });
  robot.hear(/pu/, res => {
    res.send({
      type: "stamp",
      name: "pu"
    });
  });

  corn.schedule("0 0 7,12,18 * * *", () => {
    robot.send({ channelID: "06a78616-4de5-4195-826d-ad834912e215" }, ":3kaimitarashinu_beksinski_1:");
  });
}