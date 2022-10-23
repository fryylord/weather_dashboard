const apiKey = '7513e3f067ff846492d0f20633a62466'
var timeDisplayEl = $('#dayTime');
var searchText = $('#searchText');
var searchButton = $('#searchButton');
var citiesList = $('#cities-list');
var clearFieldsBtn = $('#clearButton');
    
function displayTime() {
  var rightNow = moment().format('hh:mm:ss a [on] MMM DD, YYYY ');
  timeDisplayEl.text(rightNow);
  }
  setInterval(displayTime, 1000);

if (localStorage.getItem('cityHist') === null) {
      var localData = { cities: [] };
      localStorage.setItem('cityHist', JSON.stringify(localData));
    } 
      else {
      localData = JSON.parse(localStorage.getItem('cityHist'));
    }

function insertToLocal(city) {
    if (localData.cities.includes(city) === false) {
        localData.cities.push(city);
        localStorage.setItem('cityHist', JSON.stringify(localData));
    }
}

function displayRecentCities() {
  citiesList.empty();
  localData.cities.forEach(element => {
    var currentCity = $('<div>').text(element);
    currentCity.addClass(['list-group-item', 'list-group-item-action', 'recent-city']);
    currentCity.attr('data-city', element);
    citiesList.append(currentCity);
    currentCity.on('click', function (e) {
      e.preventDefault();
      $('#fiveDay').empty();
      callAPI($(this).attr('data-city'));
      })
  });
}

function callAPI(city) {
  $.ajax({
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial',
      method: "GET",
      error: (err => {
          alert("Your city was not found. Check your spelling or enter a city code")
          return;
        })
  }).then(function (data) {
      console.log(data)
      $(".current-weather").empty()
      var cityMain = $("<div col-12>").append($("<p><h2>" + data.name  + "</h2><p>"));
      var image = $('<img class="imgsize">').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');        
      var degreeMain = $('<p>').text('Temperature : ' + data.main.temp + ' °F');
      var humidityMain = $('<p>').text('Humidity : ' + data.main.humidity + '%');
      var windMain = $('<p>').text('Wind Speed : ' + data.wind.speed + 'MPH');       

      cityMain.append(image).append(degreeMain).append(humidityMain).append(windMain);
      $('#current-weather').empty();
      $('#current-weather').append(cityMain);
      
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      displayForecast(lat,lon);
      })
  }

function displayForecast(lat, lon) {
    $.ajax({ 
        url: 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial',
        method: "GET",
    }).then(function (response) {
        var arrayList = response.list;
        for (var i = 0; i < arrayList.length; i++) {
            if (arrayList[i].dt_txt.split(' ')[1] === '12:00:00') {
                var cityMain = $('<div>');
                cityMain.addClass('col bg-primary text-white ml-3 mb-3 rounded>');
                var fiveDayDate = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var cityTemp = $('<p>').text('Temp : ' + arrayList[i].main.temp + ' °F ');               
                var cityWind = $('<p>').text('Wind Speed : ' + arrayList[i].wind.speed + 'MPH'); 
                var cityHumid = $('<p>').text('Humidity : ' + arrayList[i].main.humidity + '%');
                var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');            
                cityMain.append(fiveDayDate).append(cityTemp).append(cityWind).append(cityHumid).append(image);
                $('#fiveDay').append(cityMain);
            }
        }
    });
};

searchButton.on('click', function (e) {
    $('#fiveDay').empty();  
    e.preventDefault();
      var city = searchText.val();
      insertToLocal(searchText.val());
      searchText.val('');
      displayRecentCities();
      callAPI(city);
});

function refreshPage(){
    window.location.reload();
} 

clearFieldsBtn.on('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    displayRecentCities();
    refreshPage();
})

displayRecentCities();
  