"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
const traq_1 = require("@traptitech/traq");
const api = new traq_1.Apis(new traq_1.Configuration({
    accessToken: process.env.HUBOT_TRAQ_ACCESS_TOKEN
}));
module.exports = (robot) => {
    robot.hear(/ping$/i, async (res) => {
        await res.send("pong");
    });
    robot.hear(/hoge$/i, async (res) => {
        await res.reply("fuga");
    });
};
