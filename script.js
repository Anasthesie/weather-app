const myApiKey = "ffda1be21c57d59826201081fa8e338c";
const city = "batumi";
const limit = 1;
const locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=${limit}&appid=${myApiKey}`;

async function getWeatherDataForCity() {
  const locationResponse = await fetch(locationUrl);
  const locationData = await locationResponse.json();

  const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${locationData[0].lat}&lon=${locationData[0].lon}&appid=${myApiKey}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  return weatherData;
}

getWeatherDataForCity().then((weatherData) => {
  console.log(weatherData);
  writeCityName(weatherData.city.name);
  writeTemperature(Math.round(weatherData.list[0].main.temp));
  writeWeatherType(weatherData.list[0].weather[0].main);
});

function writeCityName(name) {
  document.getElementById("city").innerHTML = name;
}

function writeTemperature(temperature) {
  document.getElementById("temperature").innerHTML = temperature + "&deg;";
}

function writeWeatherType(type) {
  document.getElementById("type").innerHTML = type;
  const cardBg = document.getElementById("maincard");

  if (type === "Rain") {
    cardBg.style.background = "linear-gradient(to bottom, #a1c4fd, #c2e9fb)";
  } else if (type === "Clear") {
    cardBg.style.background = "linear-gradient(to bottom, #ffe680, #ffd54f)";
  } else if (type === "Clouds") {
    cardBg.style.background = "linear-gradient(to bottom, #e0eafc, #a9c0ff)";
  } else if (type === "Snow") {
    cardBg.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)";
  } else if (type === "Thunderstorm") {
    cardBg.style.background = "linear-gradient(to bottom, #485563, #29323c)";
  } else if (type === "Drizzle") {
    cardBg.style.background = "linear-gradient(to bottom, #cfd9df, #e2ebf0)";
  } else if (type === "Mist" || type === "Fog") {
    cardBg.style.background = "linear-gradient(to bottom, #d3cce3, #e9e4f0)";
  } else {
    cardBg.style.background = "linear-gradient(to bottom, #f0f0f0, #ffffff)";
  }
}
