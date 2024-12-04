// Commands:
//  ぬるぽ - ガッ！
//

"use strict";

module.exports = async robot => {
    robot.respond(/ping$/i, res => {
        res.reply("pong");
    });
};