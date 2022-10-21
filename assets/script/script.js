const apiKey = '7513e3f067ff846492d0f20633a62466'
var timeDisplayEl = $('#dayTime');
    
function displayTime() {
  var rightNow = moment().format('hh:mm:ss a [on] MMM DD, YYYY ');
  timeDisplayEl.text(rightNow);
  }
  setInterval(displayTime, 1000);