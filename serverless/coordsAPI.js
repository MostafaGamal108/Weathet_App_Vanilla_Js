const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { entryTxt, unit } = params;
  const regex = /^\d+$/g;
  const flag = regex.test(entryTxt) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryTxt}&units=${unit}&appid=${WEATHER_API_KEY}`;
    const encodedUrl = encodeURI(url)
  try {
    const weatherCoords = await fetch(encodedUrl)
    const weatherCoordsJson = await weatherCoords.json()
    return {
        statusCode : 200,
        body : JSON.stringify(weatherCoordsJson)
    }

  } catch (err) {
    return {statusCode : 422,body : err.stack}
  }
};
