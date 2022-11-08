var openWeatherApiKey = 'e23340d9ced2b6d0b079eff94c36708e';
var openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}'
var userFormEl = $('#city-search');
var col2El = $('.col2');
var cityInputEl = $('#city');
var fiveDayEl = $('#five-day');
var searchHistoryEl = $('#search-history');
var currentDay = moment().format('M/DD/YYYY');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
var searchHistoryArray = loadSearchHistory();

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}
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
        var searchHistoryBtn = $('<button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#current-weather').remove();
            $('#five-day').empty();
            $('#five-day-header').remove();
            getWeather(city);
        })

        .attr( {
            type: 'button'
        });
        searchHistoryEl.append(searchHistoryBtn);
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


                    fetch(apiOneCallUrl)
                    .then(function (weatherResponse) {
                        if (weatherResponse.ok) {
                            weatherResponse.json().then(function (weatherData) {

                                // ** CURRENT DAY DISPLAY ** //

                                //add div to hold current day details
                                var currentWeatherEl = $('<div>')
                                    .attr({
                                        id: 'current-weather'
                                    })
                                    var weatherIcon = weatherData.current.weather[0].icon;
                                    var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

                                    // create h2 to display city + current day + current weather icon
                                    var currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ')');
                                    // create img element to display icon
                                    var iconImgEl = $('<img>')
                                        .attr({
                                            id: 'current-weather-icon',
                                            src: cityCurrentWeatherIcon,
                                            alt: 'Weather Icon'
                                        })  
                                        
                                    // current weather details
                                    var currWeatherListEl = $('<ul>')

                                    var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                                    for (var i = 0; i < currWeatherDetails.length; i++) {
                                        
                                        if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

                                            var currWeatherListItem = $('<li>')
                                                .text('UV Index: ')

                                            currWeatherListEl.append(currWeatherListItem);

                                            var uviItem = $('<span>')
                                                .text(weatherData.current.uvi);

                                            if (uviItem.text() <= 2) {
                                                uviItem.addClass('favorable');
                                            } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                                                uviItem.addClass('moderate');
                                            } else {
                                                uviItem.addClass('severe');
                                            }

                                            currWeatherListItem.append(uviItem);

                                            //create every list item that isn't uvIndex
                                        } else {
                                            var currWeatherListItem = $('<li>')
                                                .text(currWeatherDetails[i])
                                            //append to ul
                                            currWeatherListEl.append(currWeatherListItem);
                                        }

                                    }

                                    //append current weather div to col2 before #five-day
                                    $('#five-day').before(currentWeatherEl);
                                    //append current weather heading to current weather div
                                    currentWeatherEl.append(currentWeatherHeadingEl);
                                    //append icon to current weather header
                                    currentWeatherHeadingEl.append(iconImgEl);
                                    //append ul to current weather
                                    currentWeatherEl.append(currWeatherListEl);

                                    // ** END CURRENT DAY DISPLAY ** //

                                    // ** START 5-DAY FORECAST DISPLAY ** //

                                    //create h2 header for 5-day forecast
                                    var fiveDayHeaderEl = $('<h2>')
                                        .text('5-Day Forecast:')
                                        .attr({
                                            id: 'five-day-header'
                                        })

                                    //append 5 day forecast header to col2 after current weather div
                                    $('#current-weather').after(fiveDayHeaderEl)

                                    var fiveDayArray = [];

                                    for (var i = 0; i < 5; i++) {
                                        let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                                        fiveDayArray.push(forecastDate);
                                    }

                                    for (var i = 0; i < fiveDayArray.length; i++) {
                                        // create a div for each card
                                        var cardDivEl = $('<div>')
                                            .addClass('col3');

                                        // create div for the card body
                                        var cardBodyDivEl = $('<div>')
                                            .addClass('card-body');

                                        // create the card-title
                                        var cardTitleEl = $('<h3>')
                                            .addClass('card-title')
                                            .text(fiveDayArray[i]);

                                        // create the icon for current day weather
                                        var forecastIcon = weatherData.daily[i].weather[0].icon;

                                        var forecastIconEl = $('<img>')
                                            .attr({
                                                src: weatherIconUrl + forecastIcon + '.png',
                                                alt: 'Weather Icon'
                                            });

                                            var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
                                        //create temp
                                        var tempEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Temp: ' + weatherData.daily[i].temp.max)
                                        //create wind
                                        var windEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')
                                        // create humidity
                                        var humidityEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Humidity: ' + weatherData.daily[i].humidity + '%')


                                            fiveDayEl.append(cardDivEl);
                                        //append cardBodyDivEL to cardDivEl
                                        cardDivEl.append(cardBodyDivEl);
                                        //append card title to card body
                                        cardBodyDivEl.append(cardTitleEl);
                                        //append icon to card body
                                        cardBodyDivEl.append(forecastIconEl);
                                        //append temp details to card body
                                        cardBodyDivEl.append(tempEL);
                                        //append wind details to card body
                                        cardBodyDivEl.append(windEL);
                                        //append humidity details to card body
                                        cardBodyDivEl.append(humidityEL);
                                    }

                                    // ** END 5-DAY FORECAST DISPLAY ** //
                                })
                            }
                        })
                });

            } else {
                alert('Error: Open Weather could not find city')
            }
        })
        // if fetch fails
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
}

//function to push button elements to 

function submitCitySearch(event) {
    event.preventDefault();

    //get value from user input
    var city = titleCase(cityInputEl.val().trim());

    //prevent them from searching for cities stored in local storage
    if (searchHistoryArray.searchedCity.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.');
        cityInputEl.val('');
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryArray.searchedCity.push(city);
        saveSearchHistory();
        //empty the form text area
        cityInputEl.val('');
        
        //if user doesn't type in a city
    } else {
        alert('Please enter a city');
    }
}

// on submission of user data get user input for city and fetch api data
userFormEL.on('submit', submitCitySearch);

// on click of search button - empty the current weather and 5-day forecast info
$('#search-btn').on('click', function () {
    $('#current-weather').remove();
    $('#five-day').empty();
    $('#five-day-header').remove();
})


