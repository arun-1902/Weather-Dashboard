const apiKey = "6b71d65297377d31e4522228bfbed593";

/* =========================
   LIVE CITY SUGGESTIONS
========================= */
async function showSuggestions() {
  const input = document.getElementById("cityInput").value.trim();
  const box = document.getElementById("suggestions");

  box.innerHTML = "";

  if (input.length < 2) {
    box.style.display = "none";
    return;
  }

  try {
    const url =
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0) {
      box.style.display = "none";
      return;
    }

    data.forEach(place => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");

      // ✅ show city + country (better UX)
      div.innerText = `${place.name}, ${place.country}`;

      div.onclick = () => {
        document.getElementById("cityInput").value = place.name;
        box.style.display = "none";
      };

      box.appendChild(div);
    });

    box.style.display = "block";

  } catch (err) {
    console.log(err);
  }
}

/* =========================
   GET WEATHER (FIXED)
========================= */
async function getWeather() {

  let city = document.getElementById("cityInput").value.trim();

  document.getElementById("suggestions").style.display = "none";

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // ✅ FIX: remove extra text like "Delhi, IN"
  city = city.split(",")[0].trim();

  const weatherURL =
  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

const forecastURL =
  `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    console.log("Weather:", weatherData);

    if (Number(weatherData.cod) != 200) {
      alert("City not found. Try again.");
      return;
    }

    displayWeather(weatherData);

    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    displayForecast(forecastData);

  } catch (error) {
    console.log(error);
    alert("Error fetching weather data");
  }
}

/* =========================
   DISPLAY CURRENT WEATHER
========================= */
function displayWeather(data) {

  document.getElementById("cityName").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").innerText =
    `🌡 Temperature: ${data.main.temp} °C`;

  document.getElementById("description").innerText =
    `☁ Weather: ${data.weather[0].description}`;

  document.getElementById("humidity").innerText =
    `💧 Humidity: ${data.main.humidity}%`;

  document.getElementById("wind").innerText =
    `🌬 Wind Speed: ${data.wind.speed} m/s`;
}

/* =========================
   DISPLAY FORECAST
========================= */
function displayForecast(data) {

  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  const filtered = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  filtered.forEach(item => {

    const date = new Date(item.dt_txt);

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h3>${date.toDateString()}</h3>
      <p>🌡 ${item.main.temp} °C</p>
      <p>${item.weather[0].description}</p>
    `;

    container.appendChild(card);
  });
}

/* =========================
   CLOSE DROPDOWN OUTSIDE CLICK
========================= */
document.addEventListener("click", function (e) {
  const box = document.getElementById("suggestions");
  const input = document.getElementById("cityInput");

  if (e.target !== input) {
    box.style.display = "none";
  }
});