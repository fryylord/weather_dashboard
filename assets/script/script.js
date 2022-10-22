const apiKey = '7513e3f067ff846492d0f20633a62466'
var timeDisplayEl = $('#dayTime');
    
function displayTime() {
  var rightNow = moment().format('hh:mm:ss a [on] MMM DD, YYYY ');
  timeDisplayEl.text(rightNow);
  }
  setInterval(displayTime, 1000);

$().ready(function () {

  if (localStorage.getItem('cityHist') === null) {
      var localData = { cities: [] };
      localStorage.setItem('cityHist', JSON.stringify(localData));
  } else {
      localData = JSON.parse(localStorage.getItem('cityHist'));
  }

  var searchText = $('#searchText');
  var searchButton = $('#searchButton');
  var citiesList = $('#cities-list');
  var clearFieldsBtn = $('#clearButton');

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

          var iconURL = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
          var iconElement = $('<img>').attr('src', iconURL)
          iconElement.attr('alt', data.weather[0].description);
          $('#current-weather').append(iconElement);
      })
  }



  searchButton.on('click', function (e) {
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

  displayRecentCities();})