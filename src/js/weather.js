const weather = (function () {
	function Weather() {
		this.hasGeolocation = false;
		if ('geolocation' in navigator) {
			this.hasGeolocation = true;
			return this;
		}
	}

	Weather.prototype.getCurrentPosition = function () {
		const self = this;
		return new Promise((resolve, reject) => {
			if (!self.hasGeolocation) {
				reject(new Error('Browser does not support this feature, please update it'));
			}
			navigator.geolocation.getCurrentPosition(position => {
				self.longitude = position.coords.longitude;
				self.latitude = position.coords.latitude;
				window.localStorage.setItem('longitude', this.longitude);
				window.localStorage.setItem('latitude', this.latitude);
				resolve(self);
			});
		})
	}

	Weather.prototype.getCurrentWheather = function () {
		if (this.latitude && this.longitude) {
			const END_POINT = `https://fcc-weather-api.glitch.me/api/current?lat=${this.latitude}&lon=${this.longitude}`;
			return window.fetch(END_POINT)
				.then(resp => resp.json())
				.catch(console.error);
		}
		throw new Error('Missing values to get wheather');
	}

	return new Weather();
})();

module.exports = weather;
