# BeerWeather
Beer recommendations based on your local weather.

Visit https://ncko.github.io/BeerWeather/ to try it out.

## Technology Used
* HTML5
* CSS3
* JavaScript
* jQuery 3.2.1
* [OpenBreweryDB API](http://www.brewerydb.com/developers) via a custom server
* [OpenWeather API](http://openweathermap.org/api)
* [Geocode.xyz API](https://geocode.xyz/)

## Application Architecture
A custom [EventEmitter](https://github.com/ncko/BeerWeather/blob/master/js/event-emitter.js) is used to keep all components decoupled. An `init-app` event triggers the initialization of all other modules.

Three modules control the presentational layer of the application:
* [The Start Screen](https://github.com/ncko/BeerWeather/blob/master/js/start-screen.js)
* [The Progress Screen](https://github.com/ncko/BeerWeather/blob/master/js/progress-screen.js)
* [The Results Screen](https://github.com/ncko/BeerWeather/blob/master/js/results-screen.js)

[The Engine Module](https://github.com/ncko/BeerWeather/blob/master/js/engine.js) receives information from other modules, makes requests to all APIs and generates a set of recommendations.

## Screenshots
![Screen shot of the start screen](https://github.com/nicklolsen/BeerWeather/blob/redesign-v2/ProjectFiles/screenshot.start-screen.png "A screen shot of the starting screen")

![Screen shot of the results screen](https://github.com/nicklolsen/BeerWeather/blob/redesign-v2/ProjectFiles/screenshot.results-screen.png "A screen shot of the results screen")

## Possible Improvements
* Develop a more efficient algorithm for the generating recommendations
* Use a more dependable method for finding the users coordinates
* On the results screen, allow the user to use the back button to go back to the start screen
* Provide typeahead functionality to the location input
* Let the user type in a zip code OR city name

