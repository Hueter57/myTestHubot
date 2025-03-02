"use strict";
// Description:
//
// Commands:
//
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const BOT_ID_NAME = "HUBOT_TRAQ_BOT_ID";
module.exports = (robot) => {
    robot.respond(/join$/i, async (res) => {
        console.log("join");
        const id = process.env[BOT_ID_NAME];
        if (res.message.room.type !== "channel") {
            res.send("このコマンドはチャンネルでのみ受け付けています");
            return;
        }
        const channelId = res.message.room.id;
        try {
            const response = await axios.post(`https://q.trap.jp/api/v3/bots/${id}/actions/join`, {
                channelId: channelId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`
                }
            });
            if (response.status === 204) {
                res.send("joined");
            }
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                res.send(":doko:");
            }
            else {
                res.send("error");
                console.error(error);
            }
        }
    });
    robot.respond(/leave$/i, async (res) => {
        console.log("leave");
        const id = process.env[BOT_ID_NAME];
        if (res.message.room.type !== "channel") {
            res.send("このコマンドはチャンネルでのみ受け付けています");
            return;
        }
        const channelId = res.message.room.id;
        try {
            const response = await axios.post(`https://q.trap.jp/api/v3/bots/${id}/actions/leave`, {
                channelId: channelId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`
                }
            });
            if (response.status === 204) {
                res.send("leaved");
            }
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                res.send(":doko:");
            }
            else {
                res.send("error");
                console.error(error);
            }
        }
    });
};
