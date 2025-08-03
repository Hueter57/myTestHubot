"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (robot) => {
    robot.hear(/getValue (.+)$/i, async (res) => {
        const value = res.match.join(", ");
        const num = res.match[2].index;
        const input = res.match[3];
        res.send(`value : ${value}, index: ${num}, input: ${input}`);
    });
    robot.hear(/getValues ([^,]+),([^,]+)$/i, async (res) => {
        const value = res.match.join(", ");
        const num = res.match[2].index;
        const input = res.match[3];
        res.send(`value : ${value}, index: ${num}, input: ${input}`);
    });
};
