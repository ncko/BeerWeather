# BeerWeather

This app takes a string representing a location, finds the weather in that location, then uses the temperature to recommend a beer.

## Screenshots
![Screen shot of the start screen](https://github.com/nicklolsen/BeerWeather/blob/master/ProjectFiles/screenshot.start-screen.jpg "A screen shot of the starting screen")

![Screen shot of the results screen](https://github.com/nicklolsen/BeerWeather/blob/master/ProjectFiles/screenshot.results-screen.jpg "A screen shot of the results screen")

## Technology Used
* HTML5
* CSS3
* JavaScript
* jQuery 3.2.1
* [OpenBreweryDP API](http://www.brewerydb.com/developers)
* [OpenWeather API](http://openweathermap.org/api)
* [Geocode.xyz API](https://geocode.xyz/)
* [json2jsonp.com](http://json2jsonp.com/)

I also created an EventEmitter object for use in the event based architecture of the app.

## Possible Improvements
* Get rid of the JSONP requests by creating a backend that contacts the OpenBreweryDB API
* Develop a more efficient algorithm for the generating recommendations
* Use a more dependable method for finding the users coordinates
* On the results screen, allow the user to use the back button to go back to the start screen
* Provide typeahead functionality to the location input
* Let the user type in a zip code OR city name