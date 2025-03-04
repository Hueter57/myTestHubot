"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
const traq_1 = require("@traptitech/traq");
const api = new traq_1.Apis(new traq_1.Configuration({
    accessToken: process.env.HUBOT_TRAQ_ACCESS_TOKEN,
}));
module.exports = (robot) => {
    robot.hear(/getAllStamp$/i, async (res) => {
        try {
            api.getStamps().then((response) => {
                if (response.statusText === "OK") {
                    res.send("get data");
                    response.data.forEach((stampData) => {
                        console.log(stampData.name + ":" + stampData.id);
                    });
                }
                else {
                    res.send(response.status.toString());
                }
            });
        }
        catch (error) {
            res.send("error");
            console.error(error);
        }
    });
    robot.hear(/getStamp (.*)$/, async (res) => {
        const name = res.match[1];
        try {
            api.getStamps().then((response) => {
                if (response.statusText === "OK") {
                    res.send(`get data
start search`);
                    response.data.some((stampData) => {
                        if (stampData.name == name) {
                            res.send(":" + stampData.name + ": : " + stampData.id);
                            return true;
                        }
                    });
                }
                else {
                    res.send(response.status.toString());
                }
            });
        }
        catch (error) {
            res.send("error");
            console.error(error);
        }
    });
};
