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

      if (response.status === 204) {
        res.send("get data");
        console.log(response);
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

      if (response.status === 204) {
        
      }

    } catch (error) {
      res.send("error");
      console.error(error);
    }
  });
}