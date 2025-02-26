const axios = require('axios');




module.exports = robot => {
  robot.hear(/getAllStamp$/i, async res => {

    try {
      const response = await axios.get(`https://q.trap.jp/api/v3/stamps?include-unicode=true`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`
        }
      });

      if (response.statusText === 'OK') {
        res.send("get data");
        console.log(response[data]);
      } else {
        res.send(response.status);
      }

    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });

  robot.hear(/getStamp (.*)$/, async res => {
    const name = res.match[1];
    try {
      const response = await axios.get(`https://q.trap.jp/api/v3/stamps?include-unicode=true`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBOT_TRAQ_ACCESS_TOKEN}`
        }
      });

      if (response.statusText === 'OK') {
        console.log(response.data.data);
        console.log(typeof response.data.data);
      } else {
        res.send(response.status);
      }

    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });
}