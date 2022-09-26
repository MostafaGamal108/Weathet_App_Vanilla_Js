export const setPlaceholderText = () => {
  const inp = document.querySelector("#searchBar__text");
  window.innerWidth < 400
    ? (inp.placeholder = "City, State, Country")
    : (inp.placeholder = "City, State, Country, or Zip Code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

const animateError = (h1) => {
  h1.classList.toggle("error");
  setTimeout(() => {
    h1.classList.toggle("error");
  }, 6000);
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currenForecast__location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const msgArray = message.split(" ");
    const mapArray = msgArray.map((msg) => {
      return msg.replace(":", ": ");
    });
    const lat =
      mapArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const lon =
      mapArray[1].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h1.textContent = `${lat} • ${lon}`;
  } else {
    h1.textContent = message;
  }
  if (message === "City Not Found" && message === "User denied Geolocation") {
    animateError(h1);
  }
};

export const updateScreenReaderConfirmation = (srMsg) => {
  document.querySelector(".confirmation").textContent = srMsg;
};

export const displayApiError = (coordsData) => {
  const properMsg = toProperCase(coordsData.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(properMsg);
};

const toProperCase = (coordsDataMsg) => {
  const txt = coordsDataMsg.split(" ");
  const properTxt = txt.map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return properTxt.join(" ");
};

export const updateDisplay = (weatherJson, currentLoc_class) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBackgroundImg(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    currentLoc_class
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(currentLoc_class.getName());
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    currentLoc_class.getUnit()
  );
  displayCurrentConditions(ccArray);
  displaySixDaysConditionsDivs(weatherJson);
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.querySelector("#currenForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDays = document.querySelector("#dailyForecast");
  sixDays.classList.toggle("zero-vis");
  sixDays.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const ccContent = document.querySelector("#currenForecast__conditions");
  deleteContent(ccContent);
  const sixDaysContent = document.querySelector("#dailyForecast__contents");
  deleteContent(sixDaysContent);
};

const deleteContent = (eleParent) => {
  eleParent.textContent = "";
};

const getWeatherClass = (icon) => {
  const firstTwoChar = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookUp = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookUp[firstTwoChar]) {
    weatherClass = weatherLookUp[firstTwoChar];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBackgroundImg = (weatherClass) => {
  document.body.classList.add(weatherClass);
  document.body.classList.forEach((_class) => {
    if (_class !== weatherClass) document.body.classList.remove(_class);
  });
};

const buildScreenReaderWeather = (weatherJson, currentLoc_Class) => {
  const tempUnit = currentLoc_Class.getUnit() === "imperial" ? "F" : "C";
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}°${tempUnit} in ${currentLoc_Class.getName()}`;
};

const setFocusOnSearch = () => {
  document.querySelector("#searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherJson, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainDiv(
    weatherJson.current.weather[0].icon,
    weatherJson.current.weather[0].description
  );
  const temp = createEle(
    "div",
    "temp",
    `${Math.round(Number(weatherJson.current.temp))}°`,
    tempUnit
  );
  const properDesc = toProperCase(weatherJson.current.weather[0].description);
  const desc = createEle("div", "desc", properDesc);
  const feels = createEle(
    "div",
    "feels",
    `Feels Like ${Math.round(Number(weatherJson.current.feels_like))}°`
  );
  const maxTemp = createEle(
    "div",
    "maxtemp",
    `High ${Math.round(Number(weatherJson.daily[0].temp.max))}°`
  );
  const minTemp = createEle(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherJson.daily[0].temp.min))}°`
  );
  const humidity = createEle(
    "div",
    "humidity",
    `Humidity ${weatherJson.current.humidity}%`
  );
  const wind = createEle(
    "div",
    "wind",
    `Wind  ${Math.round(Number(weatherJson.current.wind_speed))} ${windUnit}`
  );
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainDiv = (icon, desc) => {
  const iconDiv = createEle("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = desc;
  faIcon.setAttribute("aria-label", desc);
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createEle = (tag, _class, textContent, unit) => {
  const ele = document.createElement(tag);
  ele.classList.add(_class);
  if (textContent) {
    ele.textContent = textContent;
  }
  if (_class === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    ele.appendChild(unitDiv);
  }
  return ele;
};

const translateToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChar = icon.slice(0, 2);
  const lastChar = icon.slice(2);

  switch (firstTwoChar) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("far", "fa-snowflake");
      break;
    case "13":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("fas", "fa-question-circle");

      break;
  }
  return i;
};

const displayCurrentConditions = (ccArray) => {
  const ccEle = document.querySelector("#currenForecast__conditions");
  ccArray.forEach((ele) => {
    ccEle.append(ele);
  });
};

const displaySixDays = (ccArray) => {
  const ccEle = document.querySelector("#currenForecast__conditions");
  ccArray.forEach((ele) => {
    ccEle.append(ele);
  });
};

const displaySixDaysConditionsDivs = (weatherJson) => {
  for (let i = 1; i <= 6; i++) {
    const dfArray = createDayDivs(weatherJson.daily[i]);
    displayDailyDivs(dfArray);
  }
};

const createDayDivs = (day) => {
  const DayAppreviationTxt = getDayAppreviation(day.dt);
  const DayAppreviation = createEle("p", "dayAbbreviation", DayAppreviationTxt);
  const dayIcon = createDailyForecastIcon(
    day.weather[0].icon,
    day.weather[0].description
  );
  const dayHigh = createEle(
    "p",
    "dayHigh",
    `${Math.round(Number(day.temp.max))}°`
  );
  const dayLow = createEle(
    "p",
    "dayLow",
    `${Math.round(Number(day.temp.min))}°`
  );

  return [DayAppreviation, dayIcon, dayHigh, dayLow];
};

const getDayAppreviation = (dayAppreviation) => {
  return new Date(dayAppreviation * 1000)
    .toUTCString()
    .slice(0, 3)
    .toUpperCase();
};

const createDailyForecastIcon = (icon, desc) => {
  const img = document.createElement("img");
  img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  img.alt = desc;
  return img;
};

const displayDailyDivs = (dfArr) => {
  const dayDiv = createEle("div", "forecastDay");
  dfArr.forEach((ele) => {
    dayDiv.append(ele);
  });
  document.querySelector("#dailyForecast__contents").append(dayDiv);
};
