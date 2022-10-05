const API_KEY = "b972a6b16186a0a858b69afe29c20800";

const getCurrentWeather = async() => {
    const city = "mumbai";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    console.log(data);
}

// getCurrentWeather();