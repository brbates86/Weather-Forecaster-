var userFormEl = $('#city-search');
var col2El = $('.col2');
var fiveDayEl = $('#five-day');
var searchHistoryEl = $('#search-history');
var currentDay = moment().format('M/DD/YYYY');
var searchHistoryArray = loadSearchHistory();


function loadSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem('search history'));
    if (!searchHistoryArray) {
        searchHistoryArray = {
            searchedCity: [],
        };
    } else {
        for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
            searchHistoryArray(searchHistoryArray.searchedCity[i]);
        }
    }
    return searchHistoryArray;
}

    function saveSearchHistory() {
        localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
    };

    function searchHistory(city) {
        var searchHistoryBttn = $('<button>')
        .addClass('bttn')
        .text(city)
        .on('click', function () {
            $('#current-weather').remove();
            $('#five-day').empty();
            getWeather(city);
        })

        .attr( {
            type: 'button'
        });
        searchHistoryEl.append(searchHistoryBttn);
    }

    function getWeather(city) {
        // apiUrl for coordinates
        var apiCoordinatesUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;
        
        fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    var cityLatitude = data.coord.lat;
                    var cityLongitude = data.coord.lon;
                    // fetch weather information
                    var apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + openWeatherApiKey + '&units=imperial';


                