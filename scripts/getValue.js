"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (robot) => {
    robot.hear(/getValue (.+)$/i, async (res) => {
        const value = res.match.join(", ");
        res.send(`value : ${value}`);
    });
    robot.hear(/getValues ([^,]+),([^,]+)$/i, async (res) => {
        const value = res.match.join(", ").split(", ");
        const num = res.match[2];
        const input = res.match[3];
        res.send(`value : ${value} value1 : ${res.match[1]} index: ${num} input: ${input}`);
    });
};
