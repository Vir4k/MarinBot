const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(player, oldChannel, newChannel) {
		if (!newChannel) {
			await player.destroy();
		} else {
			player.set('moved', true);
			player.setVoiceChannel(newChannel);
			if (player.paused) return;

			setTimeout(() => {
				player.pause(true);
				setTimeout(() => player.pause(false), this.client.ws.ping * 2);
			}, this.client.ws.ping * 2);
		}
	}

};
