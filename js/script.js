var apiKey = "647cceb65b4a997f577fedc66ffdaba9";
var weatherByCityName = "api.openweathermap.org/data/2.5/weather?q={city name}&appid=" + apiKey;

function contructQueryNow(cityName) {
  return "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
}

function constructQuery5Day(cityName) {
  return "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
}

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