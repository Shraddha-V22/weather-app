const API_KEY = "b972a6b16186a0a858b69afe29c20800";

//fetching current weather data
const getCurrentWeather = async () => {
  const city = "mumbai";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return response.json();
};

//fetching 5days/3hours data
const getHourlyForecast = async ({ name: city }) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();
  return data.list.map((forecast) => {
    const {
      main: { temp, temp_min, temp_max },
      dt,
      dt_txt,
      weather: [{ description, icon }],
    } = forecast;
    return { temp, temp_min, temp_max, dt, dt_txt, description, icon };
  });
};

//helper-function for formatting the temp
const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
//helper function for getting icon url
const getIcon = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

//function for loading the data in current weather section
const loadCurrentWeather = ({
  name,
  main: { temp, temp_min, temp_max },
  weather: { description },
}) => {
  const currentWeatherData = document.querySelector("#current-forecast");
  currentWeatherData.querySelector(".city").textContent = name;
  currentWeatherData.querySelector(".temp").textContent =
    formatTemperature(temp);
  currentWeatherData.querySelector(
    ".high-low"
  ).textContent = `H: ${formatTemperature(temp_max)} L: ${formatTemperature(
    temp_min
  )}`;
  currentWeatherData.querySelector(".descp").textContent = description;
};

//loading hourly forecast data in the section
const loadHourlyForecast = (hourlyForecast) => {
  console.log(hourlyForecast);
  const dataFor12Hours = hourlyForecast.slice(1, 13);
  let innerHTML = "";

  for (let { temp, icon, dt_txt} of dataFor12Hours) {
    innerHTML += 
      `<article>
        <h3 class="time">${dt_txt.split(" ")[1]}</h3>
        <img class="icon" src=${getIcon(icon)} alt=""/>
        <p class="hourly-temp">${formatTemperature(temp)}</p>
      </article>`;
  }
  document.querySelector(".hourly-container").innerHTML = innerHTML;
};

//loading feels like section 
const loadFeelsLike = ({main: {feels_like}}) => {
    const container = document.querySelector("#feels-like");
    container.querySelector(".feels-temp").textContent = formatTemperature(feels_like);
}

//loading humidity section 
const loadHumidity = ({main: {humidity}}) => {
    const container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = humidity;
}

//function for loading all the data by calling all the loading functions
const loadData = async () => {
  const currentWeather = await getCurrentWeather();
  loadCurrentWeather(currentWeather);
  const hourlyForecast = await getHourlyForecast(currentWeather);
  loadHourlyForecast(hourlyForecast);
  loadFeelsLike(currentWeather);
  loadHumidity(currentWeather);
};

//calling the function
loadData();
