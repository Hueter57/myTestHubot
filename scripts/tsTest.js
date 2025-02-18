"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (robot) => {
    robot.hear(/ping$/i, async (res) => {
        await res.send(":no_good: kissy :ok_woman: kisshy");
    });
};
