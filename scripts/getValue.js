"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (robot) => {
    robot.hear(/getValue (.+)$/i, async (res) => {
        const value = res.match.join(", ");
        res.send(`The value is: ${value}`);
    });
};
