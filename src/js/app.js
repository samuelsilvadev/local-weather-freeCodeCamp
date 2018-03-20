(function () {
	const weather = require('./weather.js');
	console.log(weather);
	weather
		.getCurrentPosition()
		.then(resp => {
			resp.getCurrentWheather()
				.then(createViewWeather);
		})

	function createViewWeather(data) {
		const city = data.name;
		const temp = data.main.temp;
		const weather = data.weather[0];
		const $title = document.querySelector('.weather__content__title > h5');
		const $temperature = document.querySelector('.weather__content__temperature > span');
		const $description = document.querySelector('.weather__content__description');

		$title.innerHTML = city;
		$temperature.innerHTML = `${temp}°`;
		$description.innerHTML =
			`
				<span>${weather.description}</span><br>
				<img class="" src="${weather.icon}" alt="${weather.description}">
			`;
	}
})();
