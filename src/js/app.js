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
		const $typeTemperature = document.querySelector('#js-type-temperature');

		$title.innerHTML = city;
		$temperature.innerHTML = `${temp}°`;
		$description.innerHTML =
			`<span>${weather.description}</span><br>` +
			(weather.icon ? `<img src="${weather.icon}" alt="${weather.description}">` : '');

		$typeTemperature.addEventListener('click', (e) => {
			const text = e.srcElement;
			if (text && text.textContent === 'C') {
				text.textContent = 'F';
				$temperature.textContent = celsiusToFahrenheit($temperature.textContent.replace(/°/, '')) + '°';
			} else {
				text.textContent = 'C';
				$temperature.textContent = fahrenheitToCelsius($temperature.textContent.replace(/°/, '')) + '°';
			}
		})
	}

	function fahrenheitToCelsius(temperature) {
		return Math.floor((temperature - 32) * (5 / 9));
	}

	function celsiusToFahrenheit(temperature) {
		return Math.floor(temperature * 9 / 5 + 32);
	}
})();
