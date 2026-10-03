let cityInput = document.querySelector("#search");
let button = document.querySelector("#searchBtn");
let weather = document.querySelector("#weather");


// Search button
button.addEventListener("click", getWeather);


// Enter key
cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        weather.textContent = "Please enter a city!";
        return;
    }

    weather.textContent = "Loading...";


    // City name → Latitude + Longitude
    const locationUrl =
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const locationResponse = await fetch(locationUrl);

    const locationData = await locationResponse.json();


    if (!locationData.results) {
        weather.textContent = "City not found";
        return;
    }


    const location = locationData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;


    // Weather API
    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    const weatherData = await weatherResponse.json();


    const currentWeather = weatherData.current;
    const dailyWeather = weatherData.daily;


    // -----------------------------
    // Day / Night
    // -----------------------------

    let dayNight = "";
    let dayNightIcon = "";


    if (currentWeather.is_day === 1) {

        dayNight = "Day";
        dayNightIcon = "☀️";

        document.body.classList.remove("night");
        document.body.classList.add("day");

    } else {

        dayNight = "Night";
        dayNightIcon = "🌙";

        document.body.classList.remove("day");
        document.body.classList.add("night");

    }


    // -----------------------------
    // Weather condition
    // -----------------------------

    let condition = "";
    let icon = "";


    if (currentWeather.weather_code === 0) {

        condition = "Clear Sky";
        icon = "☀️";

    } else if (
        currentWeather.weather_code === 1 ||
        currentWeather.weather_code === 2
    ) {

        condition = "Partly Cloudy";
        icon = "⛅";

    } else if (currentWeather.weather_code === 3) {

        condition = "Cloudy";
        icon = "☁️";

    } else if (
        currentWeather.weather_code === 51 ||
        currentWeather.weather_code === 53 ||
        currentWeather.weather_code === 55
    ) {

        condition = "Drizzle";
        icon = "🌦️";

    } else if (
        currentWeather.weather_code === 61 ||
        currentWeather.weather_code === 63 ||
        currentWeather.weather_code === 65
    ) {

        condition = "Rain";
        icon = "🌧️";

    } else if (
        currentWeather.weather_code === 71 ||
        currentWeather.weather_code === 73 ||
        currentWeather.weather_code === 75
    ) {

        condition = "Snow";
        icon = "❄️";

    } else {

        condition = "Weather condition unavailable";
        icon = "🌍";

    }


    // -----------------------------
    // Weather display
    // -----------------------------

    weather.innerHTML = `

        <h2>${location.name}</h2>

        <div class="day-night">
            ${dayNightIcon} ${dayNight}
        </div>

        <div class="weather-icon">
            ${icon}
        </div>

        <h3>${condition}</h3>


        <div class="weather-info">

            <div class="weather-card">
                <span>🌡️</span>
                <p>Temperature</p>
                <strong>
                    ${currentWeather.temperature_2m} °C
                </strong>
            </div>


            <div class="weather-card">
                <span>🌡️</span>
                <p>Feels Like</p>
                <strong>
                    ${currentWeather.apparent_temperature} °C
                </strong>
            </div>


            <div class="weather-card">
                <span>💧</span>
                <p>Humidity</p>
                <strong>
                    ${currentWeather.relative_humidity_2m}%
                </strong>
            </div>


            <div class="weather-card">
                <span>💨</span>
                <p>Wind Speed</p>
                <strong>
                    ${currentWeather.wind_speed_10m} km/h
                </strong>
            </div>


            <div class="weather-card">
                <span>🔺</span>
                <p>High</p>
                <strong>
                    ${dailyWeather.temperature_2m_max[0]} °C
                </strong>
            </div>


            <div class="weather-card">
                <span>🔻</span>
                <p>Low</p>
                <strong>
                    ${dailyWeather.temperature_2m_min[0]} °C
                </strong>
            </div>

        </div>

    `;
}