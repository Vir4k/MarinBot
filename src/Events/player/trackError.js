const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(player, track, payload) {
		await player.stop();
	}

};
