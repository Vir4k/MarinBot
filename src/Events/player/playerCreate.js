const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player) {
		player.setVolume(100);
		player.set('autoplay', false);
		player.set('filter', undefined);
		player.set('repeatMode', 0);
		player.set('previousQueue', []);
	}

};
