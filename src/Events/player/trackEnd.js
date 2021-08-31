const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player, track) {
		const queueTracks = player.get('previousQueue');
		queueTracks.push(track);
		player.set('previousQueue', queueTracks);
	}

};
