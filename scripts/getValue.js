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
        const value = res.match[0];
        const value1 = res.match[1];
        const value2 = res.match[2];
        res.send(`value : ${value} value1 : ${value1} value2 : ${value2}`);
    });
};
