const apiKey = '7513e3f067ff846492d0f20633a62466'
var timeDisplayEl = $('#dayTime');
    
function displayTime() {
  var rightNow = moment().format('hh:mm:ss a [on] MMM DD, YYYY ');
  timeDisplayEl.text(rightNow);
  }
  setInterval(displayTime, 1000);

$().ready(function () {

  if (localStorage.getItem('WeatherHistory') === null) {
      var saveLocal = { cities: [] };
      localStorage.setItem('WeatherHistory', JSON.stringify(saveLocal));
  } else {
      saveLocal = JSON.parse(localStorage.getItem('WeatherHistory'));
  }

  var searchInput = $('#search-input');
  var searchBtn = $('#search-btn');
  var citiesList = $('#cities-list');

  function insertToLocal(city) {
      if (saveLocal.cities.includes(city) === false) {
          saveLocal.cities.push(city);
          localStorage.setItem('WeatherHistory', JSON.stringify(saveLocal));
      }
  }

  function displayRecentCities() {
      citiesList.empty();
      saveLocal.cities.forEach(element => {
          var currentCity = $('<div>').text(element);
          currentCity.addClass(['list-group-item', 'list-group-item-action', 'recent-city']);
          currentCity.attr('data-city', element);
          citiesList.append(currentCity);
          currentCity.on('click', function (e) {
              e.preventDefault();
              callAPI($(this).attr('data-city'));
          })
      });
  }

  function callAPI(city) {
      var urlQuery = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
      $.ajax({
          url: urlQuery,
          method: 'GET'
      }).then(function (data) {
          $('#current-weather').empty();
          $('#current-weather').append($('<h3>').text(data.name + ' ').addClass('card-title'));
          $('#current-weather').append($('<p>').text('Temperature: ' + data.main.temp + '°').addClass('card-text'));
          $('#current-weather').append($('<p>').text('Humidity: ' + data.main.humidity + '%').addClass('card-text'));
          $('#current-weather').append($('<p>').text('Wind Speed: ' + data.wind.speed + 'MPH').addClass('card-text'));
      })
  }

  searchBtn.on('click', function (e) {
      e.preventDefault();
      var city = searchInput.val();
      insertToLocal(searchInput.val());
      searchInput.val('');
      displayRecentCities();
      callAPI(city);
  });

  displayRecentCities();
});