$(document).ready(function() {
  // API key required to query the weather api (OpenWeatherMap)
  var apiKey = "647cceb65b4a997f577fedc66ffdaba9";

  // These variables are for the elements in the left-side column
  var searchBox = $("#search");
  var submitSearch = $("#submit");
  var listCities = $("#list-cities");
    
  // These variables are for the elements in the right-side column
  var cityName = $("#city-name-date");
  var cityTemp = $("#city-temp");
  var cityHumidity = $("#city-humidity");
  var cityWind = $("#city-wind");
  var cityUV = $("#city-uv");
  var fiveDayForecast = $("#5day-forecast");

  

  // This function return the url of the query to be made for the weather right now
  function constructQueryNow(cityName) {
    return "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  }
  
  // This function return the url of the query to be made for the weather for the next
  // five days
  function constructQuery5Day(cityName) {
    return "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
  }
  
  // This function return the url of the query to be made for the uv-index right now
  function constructQueryUV(cityName) {
    var lat, lon; 
    
    $.ajax({
      url: constructQueryNow(cityName),
      method: "get",
      success: function(data) {
        lat = data.coord.lat;
        lon = data.coord.lon;
      }
    });
  
    return "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  }
});
