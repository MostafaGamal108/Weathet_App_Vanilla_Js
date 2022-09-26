
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
  const regex = /^\d+$/g;
  const flag = regex.test(entryTxt) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryTxt}&units=${unit}&appid=${API_key}`;
  try {
    const dataArr = await fetch(url);
    const jsonData = await dataArr.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
};

export const getWeatherJsonFromCoords = async (currentLocClass) => {
  const lat = currentLocClass.getLat();
  const lon = currentLocClass.getLon();
  const unit = currentLocClass.getUnit();
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${unit}&appid=${API_key}
  `;
  try {
    const fetchUrl = await fetch(url);
    const fetchUrlJson = await fetchUrl.json();
    return fetchUrlJson;
  } catch (error) {
    console.error(error);
  }
};
