// Commands:
//  ぬるぽ - ガッ！
//

"use strict";

module.exports = async robot => {
    robot.respond(/hello$/i, res => {
        res.reply("fuck");
    });
};