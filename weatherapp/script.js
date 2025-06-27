function getWeather() {
  const apiKey = '';
  const city = document.getElementById('city').value.trim();

  if (!city) {
    alert('Please enter a city');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error);
      alert('Error: ' + error.message);
    });

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
      alert('Error: ' + error.message);
    });
}

function displayWeather(data) {
  const tempDiv = document.getElementById('temp-div');
  const infoDiv = document.getElementById('weather-info');
  const iconImg = document.getElementById('weather-icon');
  const forecastDiv = document.getElementById('hourly-forecast');

  // Clear old data
  tempDiv.innerHTML = '';
  infoDiv.innerHTML = '';
  forecastDiv.innerHTML = '';
  iconImg.style.display = 'none';

  const cityName = data.name;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  const timeNow = new Date().toLocaleString();

  tempDiv.innerHTML = `<p>${temp}°C</p>`;
  iconImg.src = iconUrl;
  iconImg.alt = desc;
  iconImg.style.display = 'block';

  infoDiv.innerHTML = `
    <h2>${cityName}</h2>
    <p>${desc}</p>
    <p>Feels Like: ${feelsLike}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${wind} m/s</p>
    <p>Sunrise: ${sunrise} | Sunset: ${sunset}</p>
    <p>📅 ${timeNow}</p>
  `;
}

function displayHourlyForecast(hourlyData) {
  const forecastDiv = document.getElementById('hourly-forecast');
  const nextHours = hourlyData.slice(0, 8); // Next 24 hrs (8 x 3hr)

  forecastDiv.innerHTML = '<h3>Next 24 Hours</h3>';

  nextHours.forEach(item => {
    const hour = new Date(item.dt * 1000).getHours();
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    forecastDiv.innerHTML += `
      <div class="hourly-item">
        <span>${hour}:00</span><br>
        <img src="${iconUrl}" alt="">
        <br><span>${temp}°C</span>
      </div>
    `;
  });
}
