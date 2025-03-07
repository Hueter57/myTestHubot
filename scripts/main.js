"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
const corn = require("node-cron");
const myLogChannel = {
    channelID: "06a78616-4de5-4195-826d-ad834912e215",
};
const hueterDMChannel = {
    userID: "236fe853-f208-477b-9f1f-0f42fe614d3b",
};
module.exports = (robot) => {
    robot.send(myLogChannel, ":done-nya:");
    robot.hear(/send_Hueter$/, async (res) => {
        robot.send(hueterDMChannel, ":choo-choo-train-nya:");
    });
    robot.respond(/send$/i, async (res) => {
        robot.send(myLogChannel, ":good-nya:");
    });
    robot.hear(/getRes$/i, async (res) => {
        console.log(res);
    });
    robot.hear(/getRobot$/i, async (res) => {
        console.log(robot);
    });
    corn.schedule("0 0 7,12,18 * * *", () => {
        robot.send(myLogChannel, ":3kaimitarashinu_beksinski_1:");
    }, {
        Scheduled: true,
        timezone: "Asia/Tokyo"
    });
};
