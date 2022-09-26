const fetch = require("node-fetch")

const {WEATHER_API_KEY} = process.env;

exports.handler = async (event,context) => {
    const params = JSON.parse(event.body)
    const {lat,lon,unit} = params
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${unit}&appid=${WEATHER_API_KEY}`
    try {
        const weatherFetch = await fetch(url)
        const weatherJson = await weatherFetch.json();
        return {
            statusCode:200 ,
            body : JSON.stringify(weatherJson)
        }
    } catch (error) {
        return {statusCode : 422,body : error.stack}
    }
}