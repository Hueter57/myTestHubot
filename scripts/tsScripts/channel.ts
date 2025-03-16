// Description:
//
// Commands:
//

import hubot from "hubot";

const axios = require("axios");
const BOT_ID_NAME = "HUBOT_TRAQ_BOT_ID";
import { Apis, Configuration } from "@traptitech/traq";

const api = new Apis(
  new Configuration({
    accessToken: process.env.HUBOT_TRAQ_ACCESS_TOKEN,
  })
);

module.exports = (robot: hubot.Robot): void => {
  robot.respond(/join$/i, async (res: hubot.Response) => {
    console.log("join");
    const id = process.env[BOT_ID_NAME];
    if (res.message.room.type !== "channel") {
      res.send("このコマンドはチャンネルでのみ受け付けています");
      return;
    }
    const channelId = res.message.room.id;

    try {
      const response = await axios.post(
        `https://q.trap.jp/api/v3/bots/${id}/actions/join`,
        {
          channelId: channelId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`,
          },
        }
      );

      if (response.status === 204) {
        res.send("joined");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        res.send(":doko:");
      } else {
        res.send("error");
        console.error(error);
      }
    }
  });

  robot.respond(/leave$/i, async (res: hubot.Response) => {
    console.log("leave");
    const id = process.env[BOT_ID_NAME];
    if (res.message.room.type !== "channel") {
      res.send("このコマンドはチャンネルでのみ受け付けています");
      return;
    }
    const channelId = res.message.room.id;

    try {
      const response = await axios.post(
        `https://q.trap.jp/api/v3/bots/${id}/actions/leave`,
        {
          channelId: channelId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`,
          },
        }
      );

      if (response.status === 204) {
        res.send("leaved");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        res.send(":doko:");
      } else {
        res.send("error");
        console.error(error);
      }
    }
  });

  robot.hear(/getThisChannel$/i, async (res: hubot.Response) => {
    try {
      api.getChannel(res.message.room.id).then((response) => {
        console.log(`pearentId: ${response.data.parentId}
name: ${response.data.name}`);
        res.send(`pearentId: ${response.data.parentId}
name: ${response.data.name}`);
      });
    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });
  robot.hear(/getChannel (.*)$/i, async (res: hubot.Response) => {
    const id = res.match[1];
    try {
      api.getChannel(id).then((response) => {
        console.log(`pearentId: ${response.data.parentId}
name: ${response.data.name}`);
        res.send(`pearentId: ${response.data.parentId}
name: ${response.data.name}`);
      });
    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });

  robot.hear(/getChannelName (.*)$/i, async (res: hubot.Response) => {
    let id = res.match[1];
    let name: string[] = [];
    try {
      for (let i = 0; i < 5; i++) {
        const response = await api.getChannel(id);
        name.unshift(response.data.name);
        if (response.data.parentId === null) {
          res.send(`#${name.join("/")}`);
          return;
        } else {
          id = response.data.parentId;
        }
      }
    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });
};
