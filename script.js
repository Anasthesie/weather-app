const myApiKey = "ffda1be21c57d59826201081fa8e338c";
const limit = 1;

async function getWeatherDataForCity(city) {
  const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${myApiKey}`;
  const locationResponse = await fetch(locationUrl);
  const locationData = await locationResponse.json();

  if (locationData.length === 0) {
    alert("City not found");
  }

  const lat = locationData[0].lat;
  const lon = locationData[0].lon;
  const locationName = `${locationData[0].name}, ${locationData[0].country}`;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  return { weather: weatherData, locationName: locationName };
}

function writeCityName(name) {
  document.getElementById("city").innerHTML = name;
}

function writeTemperature(temperature) {
  document.getElementById("temperature").innerHTML = temperature + "&deg;";
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





const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  const cityInput = document.getElementById("cityinput");
  const city = cityInput.value;

  getWeatherDataForCity(city).then((data) => {
    const weatherData = data.weather;
    const cityName = data.locationName;

    writeCityName(cityName);
    writeTemperature(Math.round(weatherData.list[0].main.temp));
    writeWeatherType(weatherData.list[0].weather[0].main);
  });
});

const cityInput = document.getElementById("cityinput");
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value;

    getWeatherDataForCity(city).then((data) => {
      const weatherData = data.weather;
      const cityName = data.locationName;

      writeCityName(cityName);
      writeTemperature(Math.round(weatherData.list[0].main.temp));
      writeWeatherType(weatherData.list[0].weather[0].main);
    });
  }
});
