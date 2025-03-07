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
var times = 0;
var task = corn.schedule("0 * * * * *", () => { }, {
    Scheduled: false,
    timezone: "Asia/Tokyo",
});
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
    robot.hear(/startCorn -t ([0-9]*)$/i, async (res) => {
        times = Number(res.match[1]);
        if (times < 1) {
            return;
        }
        else if (times > 30) {
            res.send("too meny times");
            return;
        }
        task = corn.schedule("* * * * * *", () => {
            res.send(times.toString());
            times--;
            if (times === 0) {
                res.send(":explosion.wiggle:");
                task.stop();
            }
        }, {
            Scheduled: true,
            timezone: "Asia/Tokyo",
        });
    });
    corn.schedule("0 0 7,12,18 * * *", () => {
        robot.send(myLogChannel, ":3kaimitarashinu_beksinski_1:");
    }, {
        Scheduled: true,
        timezone: "Asia/Tokyo",
    });
};
