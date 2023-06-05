const axios = require("axios");

const userDetails = async (req, res, next) => {
  try {
    const ip = req.ipInfo.ip;
    const city_url = `https://ipapi.co/${
      ip === "::1" ? "106.0.53.151" : ip
    }/city/`;
    const city = await axios.get(city_url);
    const country_url = `https://ipapi.co/${
      ip === "::1" ? "106.0.53.151" : ip
    }/country/`;
    const country = await axios.get(country_url);

    let device = {
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
      platform: req.useragent.platform,
      login_time: new Date().getTime(),
    };
    req.userLocation = { country: country.data, city: city.data };
    req.userIP = ip;
    req.userDevice = device;

    next();
  } catch (error) {
    next();

    console.log(error);
  }
};

module.exports = { userDetails };
