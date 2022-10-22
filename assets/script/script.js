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
  method: 'GET'
    }).then(function (data) {
      
      $('#current-weather').empty();
      $('#current-weather').append($('<h3>').text(data.name + ' ').addClass('card-title'));
      $('#current-weather').append($('<p>').text('Temperature: ' + data.main.temp + '°').addClass('card-text'));
      $('#current-weather').append($('<p>').text('Humidity: ' + data.main.humidity + '%').addClass('card-text'));
      $('#current-weather').append($('<p>').text('Wind Speed: ' + data.wind.speed + 'MPH').addClass('card-text'));
      
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      displayForecast(lat,lon);
          
      var iconURL = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
      var iconElement = $('<img>').attr('src', iconURL)
      iconElement.attr('alt', data.weather[0].description);
      $('#current-weather').append(iconElement);
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
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp : ' + arrayList[i].main.temp + ' °F ');               
                var humidityMain = $('<p>').text('Humidity : ' + arrayList[i].main.humidity + '%');
                var windMain = $('<p>').text('Wind Speed : ' + arrayList[i].wind.speed + 'MPH');                
                cityMain.append(date5).append(degreeMain).append(humidityMain).append(windMain).append(image);
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
  