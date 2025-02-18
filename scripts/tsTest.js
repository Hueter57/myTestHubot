"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (robot) => {
    robot.hear(/ping$/i, async (res) => {
        await res.send("pong");
    });
    robot.hear(/hoge$/i, async (res) => {
        await res.reply("fuga");
    });
};
