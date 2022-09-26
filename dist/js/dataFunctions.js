import { error } from "console";
import { json } from "stream/consumers";

export const setLocationObj = (currentLocClass, myCoordsObj) => {
  const { lat, lon, name, unit } = myCoordsObj;
  currentLocClass.setLat(lat);
  currentLocClass.setLon(lon);
  currentLocClass.setName(name);
  if (unit) {
    currentLocClass.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const clearText = (text) => {
  const regex = /[ ]{2,}/gi;
  const newTxt = text.replaceAll(regex, " ").trim();
  return newTxt;
};

export const getCoordsFromApi = async (entryTxt, unit) => {

  const urlDataObj = {
    entryTxt:entryTxt,
    unit:unit
  }

  try {
    const coordsStream = await fetch("./.netlify/functions/coordsAPI")
  } catch (err) {
    
  }


};

export const getWeatherJsonFromCoords = async (currentLocClass) => {
  const urlDataObj = {
    lat: currentLocClass.getLat(),
    lon: currentLocClass.getLon(),
    unit: currentLocClass.getUnit(),
  };

  try {
    const weatherStream = await fetch("./netlify/functions/weatherJson",{
      method:"POST",
      body:JSON.stringify(urlDataObj)
    })
    const weatherJson = await weatherStream.json()
    return weatherJson
  }catch(err) {
    console.error(err)
  }
};
