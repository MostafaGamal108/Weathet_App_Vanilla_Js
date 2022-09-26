import CurrentLocation from "../js/currentLocation.js";
import {
  addSpinner,
  displayError,
  displayApiError,
  setPlaceholderText,
  updateScreenReaderConfirmation,
  updateDisplay,
} from "../js/domFunctions.js";
import {
  setLocationObj,
  getHomeLocation,
  clearText,
  getCoordsFromApi,
  getWeatherJsonFromCoords,
} from "../js/dataFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
  //add event listeners
  const geoButton = document.querySelector("#getLocation");
  geoButton.addEventListener("click", getGeoWeather);
  const homeButton = document.querySelector("#home");
  homeButton.addEventListener("click", loadWeather);
  const savedButton = document.querySelector("#saveLocation");
  savedButton.addEventListener("click", saveLocation);
  const unitButton = document.querySelector("#units");
  unitButton.addEventListener("click", setUnitPref);
  const refrechButton = document.querySelector("#refresh");
  refrechButton.addEventListener("click", refrechWeather);
  const locationEntry = document.querySelector("#searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);
  //Set up
  setPlaceholderText();
  // load weather
  loadWeather();
};

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      // add spinner
      const homeLoc = document.querySelector(".fa-location-dot");
      addSpinner(homeLoc);
    }
  }
  if (!navigator.geolocation) geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "GeoLocation not Supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position_Obj) => {
  const myCoordsObj = {
    lat: position_Obj.coords.latitude,
    lon: position_Obj.coords.longitude,
    name: `Lat: ${position_Obj.coords.latitude} Lon: ${position_Obj.coords.longitude}`,
  };
  setLocationObj(currentLoc, myCoordsObj);
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError(
      "No Home Location Saved",
      "Sorry, Please save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-house");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (savedLocation) => {
  if (typeof savedLocation === "string") {
    const savedLocation_JSON = JSON.parse(savedLocation);
    const myCoords_Obj = {
      lat: savedLocation_JSON.lat,
      lon: savedLocation_JSON.lon,
      name: savedLocation_JSON.name,
      unit: savedLocation_JSON.unit,
    };
    setLocationObj(currentLoc, myCoords_Obj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-floppy-disk");
    addSpinner(saveIcon);
    const location = {
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      name: currentLoc.getName(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.getName()} as home location`
    );
  }
};

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-underline");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
};

const refrechWeather = () => {
  const refrechIcon = document.querySelector(".fa-rotate-right");
  addSpinner(refrechIcon);
  updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.querySelector("#searchBar__text").value;
  const entryTxt = clearText(text);
  if (!entryTxt.length) return;
  const locationIcon = document.querySelector(".fa-magnifying-glass");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryTxt, currentLoc.getUnit());
  console.log(coordsData);
  if (coordsData) {
    if (coordsData.cod === 200) {
      const myCoords_Obj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      setLocationObj(currentLoc, myCoords_Obj);
      updateDataAndDisplay(currentLoc);
    } else {
      displayApiError(coordsData);
    }
  }
};

const updateDataAndDisplay = async (currentLoc_class) => {
  const weatherJson = await getWeatherJsonFromCoords(currentLoc_class);
  if (weatherJson) updateDisplay(weatherJson, currentLoc_class);
};

initApp();
