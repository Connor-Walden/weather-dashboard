$(document).ready(function() {
  // API key required to query the weather api (OpenWeatherMap)
  var apiKey = "647cceb65b4a997f577fedc66ffdaba9";

  // These variables are for the elements in the left-side column
  var searchBox = $("#search");
  var searchForm = $("#search-form");
  var submitSearch = $("#submit");
  var listCities = $("#list-cities");
    
  // These variables are for the elements in the right-side column
  var cityName = $("#city-name-date");
  var cityTemp = $("#city-temp");
  var cityHumidity = $("#city-humidity");
  var cityWind = $("#city-wind");
  var cityUV = $("#city-uv");
  var fiveDayForecast = $("#5day-forecast");

  // Saved Cities
  var savedCities = JSON.parse(localStorage.getItem("cities-saved"));
  
  // if there is data to show, show it... else create a new empty array
  if(savedCities == null) savedCities = []; else handleData(savedCities[0]);

  // Load local storage 
  updateCityList();

  // Using moment to get current date
  var today = moment();

  // When the user clicks the search button
  submitSearch.on("click", function() {
    if(searchBox.val().length > 0) {
      handleData(searchBox.val()); 
    }
  });

  // When the user hits enter
  searchForm.on("submit", function(event) {
    if(searchBox.val().length > 0) {
      handleData(searchBox.val()); 
      event.preventDefault();
    }
  });

  function updateCityList() {
    listCities.html("");

    for(var i = 0; i < savedCities.length; i++) {
      listCities.append('<ul class="list-group-item" data-city-name="' + savedCities[i] + '">' + savedCities[i] + '</ul>');
    }
  }

  // Check to see if user wants to switch to a previously searched city
  listCities.on("click", function(event) {
    var city = event.target.getAttribute("data-city-name");
    if(city != null && city != undefined) {
      handleData(city, true);
    }
  });

  function handleData(currentCity, clicked) {
    // Query the api to check if the city is in there
    $.ajax({
      url: constructQueryNow(currentCity),
      method: "get",
      success: function(data) {
        
        if(!clicked) {
          // save the search by appending to the page and saving to localstorage
          if(!savedCities.includes(currentCity)) {
            savedCities.unshift(currentCity);
            localStorage.setItem("cities-saved", JSON.stringify(savedCities));
            updateCityList();
          } else {
            // Swap positions of the first city and the city searched
            var tmp = savedCities[0];
            var index = savedCities.indexOf(currentCity);

            // The actual swap
            savedCities[0] = savedCities[index];
            savedCities[index] = tmp;
            updateCityList();
          }
        }

        // City name
        cityName.text(currentCity + " (" + today.date() + "/" + (today.month() + 1) + "/" + today.year() + ")");
      
        // current temperature, returned as kelvin so -273.15 to convert to celsius
        cityTemp.text("Temperature: " + Math.round((data.main.temp - 273.15))+" C");

        // Current humidity
        cityHumidity.text("Humidity: "+ data.main.humidity + "%");

        // Current wind speed
        cityWind.text("Wind Speed: " + data.wind.speed + " m/s");

        // Current UV index (New api call to uv api)
        $.ajax({
          url: constructQueryUV(data.coord.lat, data.coord.lon),
          method: "get",
          success: function (data) {
            // Coloring uv depending on the classes low = 0-2, medium = 3-4, moderate = 5-6, severe = 7+
            if(data.value >= 0 && data.value <=2) {
              cityUV.html('UV Index: <span class="badge bg-success">' + data.value + '</span>');
            }
            else if(data.value >= 3 && data.value <=4) {
              cityUV.html('UV Index: <span class="badge bg-secondary">' + data.value + '</span>');
            }
            else if(data.value >= 5 && data.value <=6) {
              cityUV.html('UV Index: <span class="badge bg-warning">' + data.value + '</span>');
            }
            else if(data.value >= 7) {
              cityUV.html('UV Index: <span class="badge bg-danger">' + data.value + '</span>');
            }
          }
        });

        // Current 5-day forecast (New api call to 5day api)
        $.ajax({
          url: constructQuery5Day(currentCity),
          method: "get",
          success: function (data) {
            fiveDayForecast.html("");

            for(var i = 0; i < data.cnt; i += 8)
            {
              // Update 5 day forecast
              fiveDayForecast.append('<div class="col-sm-2"><div class="card bg-primary"><h5 class="card-title">' + data.list[i].dt_txt.substring(0, 10) + '</h5><img src="http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png" class="card-img-top" alt="weather image"><p class="card-text">Temp: ' + Math.round(data.list[i].main.temp -273.15) + ' C</p><p class="card-text"> Humidity: ' + data.list[i].main.humidity + '%</p></div></div>');
            }
          }
        });
      }
    });
  }

  // This function return the url of the query to be made for the weather right now
  function constructQueryNow(cityName) {
    return "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  }
  
  // This function return the url of the query to be made for the weather for the next
  // five days
  function constructQuery5Day(cityName) {
    return "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
  }
  
  // This function return the url of the query to be made for the uv-index right now
  function constructQueryUV(lat, lon) {
    return "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  }

  // helper function
  function isWithin(a, b) {
    for(var i = 0; i < b.length; i++) {
      if(a == b[i])
        return true;
    }

    return false;
  }
});
