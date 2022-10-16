const API_KEY = "b972a6b16186a0a858b69afe29c20800";

const DAYS_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

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
  // console.log(hourlyForecast);
  const dataFor12Hours = hourlyForecast.slice(1, 13);
  let innerHTML = "";

  for (let { temp, icon, dt_txt } of dataFor12Hours) {
    innerHTML += `<article>
        <h3 class="time">${dt_txt.split(" ")[1]}</h3>
        <img class="icon" src=${getIcon(icon)} alt=""/>
        <p class="hourly-temp">${formatTemperature(temp)}</p>
      </article>`;
  }
  document.querySelector(".hourly-container").innerHTML = innerHTML;
};

const calculateDayWiseForecast = (hourlyForecast) => {
  let dayWiseForecast = new Map();
  for (let forecast of hourlyForecast) {
    const [date] = forecast.dt_txt.split(" ");
    const dayOftheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];
    if (dayWiseForecast.has(dayOftheWeek)) {
      let forecastForTheDay = dayWiseForecast.get(dayOftheWeek);
      forecastForTheDay.push(forecast);
      dayWiseForecast.set(dayOftheWeek, forecastForTheDay);
    } else {
      dayWiseForecast.set(dayOftheWeek, [forecast]);
    }
  }
  for (let [day, value] of dayWiseForecast) {
    let min_temp = Math.min(...Array.from(value, (val) => val.temp_min));
    let max_temp = Math.max(...Array.from(value, (val) => val.temp_max));

    dayWiseForecast.set(day, {
      min_temp,
      max_temp,
      icon: value.find((v) => v.icon).icon,
    });
  }
  console.log(dayWiseForecast);
  return dayWiseForecast;
};

const loadFiveDayForecast = (hourlyForecast) => {
  // console.log(hourlyForecast);
  let dayWiseForecast = calculateDayWiseForecast(hourlyForecast);
  const container = document.querySelector("#five-day-forecast-container");
  let dayWiseInfo = "";
  Array.from(dayWiseForecast).map(([day, {min_temp, max_temp, icon}], index) => {
    
    if(index < 5) {
      dayWiseInfo += `
        <article class="day-wise-forecast">
          <h3>${index === 0 ? "today": day}</h3>
          <img class="icon" src="${getIcon(icon)}" alt="icon for the forecast"/>
          <p class="min-temp">${formatTemperature(min_temp)}</p>
          <p  class="max-temp">${formatTemperature(max_temp)}</p>
        </article>`;
    }
  })
  container.innerHTML = dayWiseInfo;
};

//loading feels like section
const loadFeelsLike = ({ main: { feels_like } }) => {
  const container = document.querySelector("#feels-like");
  container.querySelector(".feels-temp").textContent =
    formatTemperature(feels_like);
};

//loading humidity section
const loadHumidity = ({ main: { humidity } }) => {
  const container = document.querySelector("#humidity");
  container.querySelector(".humidity-value").textContent = humidity;
};

//function for loading all the data by calling all the loading functions
const loadData = async () => {
  const currentWeather = await getCurrentWeather();
  loadCurrentWeather(currentWeather);
  const hourlyForecast = await getHourlyForecast(currentWeather);
  loadHourlyForecast(hourlyForecast);
  loadFiveDayForecast(hourlyForecast);
  loadFeelsLike(currentWeather);
  loadHumidity(currentWeather);
};

//calling the function
loadData();
