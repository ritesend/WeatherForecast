angular.module('weatherApp', [])
.controller('WeatherController', ['$scope', function($scope) {
    var ctrl = this;

    ctrl.getWeather = function() {
        var apiKey = 'bf5f195109519c374074271527231b11';
        var city = ctrl.city;

        if (!city) {
            alert('Please enter a city');
            return;
        }

        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                ctrl.displayWeather(data);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                alert('Error fetching current weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                ctrl.displayHourlyForecast(data.list);
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                alert('Error fetching hourly forecast data. Please try again.');
            });
    };

    ctrl.displayWeather = function(data) {
        if (data.cod === '404') {
            alert(data.message);
        } else {
            ctrl.cityName = data.name;
            ctrl.temperature = Math.round(data.main.temp - 273.15); 
            ctrl.description = data.weather[0].description;
            ctrl.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        }
    };

    ctrl.displayHourlyForecast = function(hourlyData) {
        ctrl.hourlyData = hourlyData.slice(0, 8).map(item => {
            var dateTime = new Date(item.dt * 1000); 
            var hour = dateTime.getHours();
            var temperature = Math.round(item.main.temp - 273.15); 
            var iconCode = item.weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            return {
                hour: hour,
                temperature: temperature,
                iconUrl: iconUrl
            };
        });
    };
}]);
