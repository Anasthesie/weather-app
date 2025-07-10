const myApiKey = "ffda1be21c57d59826201081fa8e338c";
const limit = 1;
let units = "metric";

async function getWeatherDataForCityFromApi(city) {
  const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${myApiKey}`;
  const locationResponse = await fetch(locationUrl);
  const locationData = await locationResponse.json();

  console.log(locationData);
  if (locationData.length === 0) {
    alert("City not found");
    return;
  }

  const lat = locationData[0].lat;
  const lon = locationData[0].lon;
  const locationName = `${locationData[0].name}, ${locationData[0].country}`;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=${units}`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  const fiveDaysInfoArray = getInfoForNextFiveDays(weatherData);
  console.log(fiveDaysInfoArray);
  writeAllDays(fiveDaysInfoArray);

  return { weather: weatherData, locationName: locationName };
}

function writeCityName(name) {
  document.getElementById("city").innerHTML = name;
}

function writeTemperature(temperature) {
  document.getElementById("temperature").innerHTML = temperature + "&deg;";
}
function writeAllDays(fiveDaysInfoArray) {
  const daysContainer = document.getElementById("five-days-container");

  daysContainer.textContent = " ";
  daysContainer.style.display = "flex";
  daysContainer.style.justifyContent = "space-between";
  daysContainer.style.padding = "20px";

  fiveDaysInfoArray.map((item) => {
    const newParagraph = document.createElement("div");
    newParagraph.textContent =
      item.date + " " + " " + item.min + " " + " " + item.max;
    daysContainer.appendChild(newParagraph);

    newParagraph.style.fontWeight = "bold";
    newParagraph.style.fontSize = "16px";
    newParagraph.style.textAlign = "center";
  });
}

function writeWeatherType(type) {
  document.getElementById("type").innerHTML = type;
  const cardBg = document.getElementById("maincard");
  const icon = document.getElementById("icon");

  icon.style.fontSize = "33px";

  if (type === "Rain") {
    cardBg.style.background = "linear-gradient(to bottom, #a1c4fd, #c2e9fb)";
    icon.className = "fas fa-cloud-showers-heavy";
    icon.style.color = "#4a90e2";
  } else if (type === "Clear") {
    cardBg.style.background = "linear-gradient(to bottom, #ffe680, #ffd54f)";
    icon.className = "fas fa-sun";
    icon.style.color = "#fbc02d";
  } else if (type === "Clouds") {
    cardBg.style.background = "linear-gradient(to bottom, #e0eafc, #a9c0ff)";
    icon.className = "fas fa-cloud";
    icon.style.color = "#90a4ae";
  } else if (type === "Snow") {
    cardBg.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)";
    icon.className = "fas fa-snowflake";
    icon.style.color = "#00acc1";
  } else if (type === "Thunderstorm") {
    cardBg.style.background = "linear-gradient(to bottom, #485563, #29323c)";
    icon.className = "fas fa-bolt";
    icon.style.color = "#ffca28";
  } else if (type === "Drizzle") {
    cardBg.style.background = "linear-gradient(to bottom, #cfd9df, #e2ebf0)";
    icon.className = "fas fa-cloud-rain";
    icon.style.color = "#81d4fa";
  } else if (type === "Mist" || type === "Fog") {
    cardBg.style.background = "linear-gradient(to bottom, #d3cce3, #e9e4f0)";
    icon.className = "fas fa-smog";
    icon.style.color = "#b0bec5";
  } else {
    cardBg.style.background = "linear-gradient(to bottom, #f0f0f0, #ffffff)";
    icon.className = "fas fa-question-circle";
    icon.style.color = "#999";
  }
}

function showWeather(city) {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
  getWeatherDataForCityFromApi(city).then((data) => {
    if (!data) {
      writeCityName("NOT FOUND");
      spinner.style.display = "none";
      return;
    }
    const weatherData = data.weather;
    const cityName = data.locationName;
    writeCityName(cityName);
    writeTemperature(Math.round(weatherData.list[0].main.temp));
    writeWeatherType(weatherData.list[0].weather[0].main);
    spinner.style.display = "none";
  });
}

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityinput");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  showWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value;
    showWeather(city);
  }
});

const toggleOn = document.getElementById("toggleIconon");
const toggleOff = document.getElementById("togglerIconOff");

toggleOn.addEventListener("click", () => {
  toggleOff.style.display = "block";
  toggleOn.style.display = "none";
  units = "standard";

  const city = cityInput.value;
  showWeather(city);
});
toggleOff.addEventListener("click", () => {
  toggleOn.style.display = "block";
  toggleOff.style.display = "none";
  units = "metric";

  const city = cityInput.value;
  showWeather(city);
});

function getInfoForOneDay(list, day) {
  const filtered = list.filter((listItem) => {
    return day === listItem.dt_txt.slice(0, 10);
  });
  const temps = filtered.map((listItem) => {
    return listItem.main.temp;
  });
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  return { minTemp: min, maxTemp: max };
}

function getInfoForNextFiveDays(weatherData) {
  const fiveDays = [];
  for (let i = 1; i < 6; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0];
    const onedayInfo = getInfoForOneDay(weatherData.list, formattedDate);

    fiveDays.push({
      date: formattedDate,
      max: onedayInfo.maxTemp,
      min: onedayInfo.minTemp,
    });
  }
  return fiveDays;
}

function darkMode() {
  const lightIcon = document.getElementById("light");
  const body = document.body;

  lightIcon.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      lightIcon.src = "./images/01_sunny_color_w32.svg";
    } else {
      body.classList.add("dark-mode");
      lightIcon.src = "./images/02_moon_stars_color_w64.svg";
    }
  });
}
darkMode();
