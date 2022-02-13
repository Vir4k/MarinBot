const { Structure } = require('erela.js');

module.exports = Structure.extend('Player', Player => {
	class ClientPlayer extends Player {

		constructor(...args) {
			super(...args);

			this.previousTracks = [];
			this.timeout = null;

			this.speed = 1;
		}

		addPreviousSong(song) {
			this.previousTracks.push(song);
			return this;
		}

	}
	return ClientPlayer;
});
