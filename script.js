async function getWeather() {

    const cityInput = document.getElementById("cityInput");

    const city = cityInput.value.trim();

    const error = document.getElementById("error");

    const loading = document.getElementById("loading");

    const weatherCard = document.getElementById("weatherCard");


    // Reset messages

    error.style.display = "none";

    weatherCard.style.display = "none";


    // Check empty input

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    try {

        loading.style.display = "block";


        // --------------------------------
        // STEP 1: Get City Coordinates
        // --------------------------------

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const geoResponse = await fetch(geoURL);


        if (!geoResponse.ok) {

            throw new Error("Unable to connect to location service.");
        }


        const geoData = await geoResponse.json();


        // Check city

        if (!geoData.results || geoData.results.length === 0) {

            throw new Error("City not found. Please enter a valid city.");
        }


        const location = geoData.results[0];


        const latitude = location.latitude;

        const longitude = location.longitude;

        const cityName = location.name;

        const country = location.country;


        // --------------------------------
        // STEP 2: Get Weather Data
        // --------------------------------

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,weather_code,wind_speed_10m&timezone=auto`;


        const weatherResponse = await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error("Unable to fetch weather data.");
        }


        const weatherData = await weatherResponse.json();


        const current = weatherData.current;


        // --------------------------------
        // STEP 3: Display Data
        // --------------------------------

        document.getElementById("cityName").textContent =
            cityName;


        document.getElementById("country").textContent =
            country;


        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;


        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;


        document.getElementById("windSpeed").textContent =
            `${current.wind_speed_10m} km/h`;


        document.getElementById("feelsLike").textContent =
            `${current.apparent_temperature}°C`;


        document.getElementById("rain").textContent =
            `${current.rain} mm`;


        // Weather condition

        const weatherInfo =
            getWeatherDescription(current.weather_code);


        document.getElementById("weatherIcon").textContent =
            weatherInfo.icon;


        document.getElementById("weatherDescription").textContent =
            weatherInfo.description;


        // Updated time

        document.getElementById("updatedTime").textContent =
            new Date().toLocaleTimeString();


        weatherCard.style.display = "block";


    } catch (error) {

        console.error(error);

        showError(error.message);


    } finally {

        loading.style.display = "none";
    }
}


// --------------------------------
// Weather Code Function
// --------------------------------

function getWeatherDescription(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️"
        };

    } else if (code === 1 || code === 2) {

        return {
            description: "Partly Cloudy",
            icon: "🌤️"
        };

    } else if (code === 3) {

        return {
            description: "Overcast",
            icon: "☁️"
        };

    } else if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Foggy",
            icon: "🌫️"
        };

    } else if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            description: "Rain",
            icon: "🌧️"
        };

    } else if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snow",
            icon: "❄️"
        };

    } else if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain Showers",
            icon: "🌦️"
        };

    } else if (
        code >= 95
    ) {

        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };

    } else {

        return {
            description: "Unknown",
            icon: "🌡️"
        };
    }
}


// --------------------------------
// Error Function
// --------------------------------

function showError(message) {

    const error = document.getElementById("error");

    error.textContent = message;

    error.style.display = "block";
}


// --------------------------------
// Enter Key Search
// --------------------------------

document
    .getElementById("cityInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            getWeather();
        }

    });