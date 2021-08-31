const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(player, oldChannel, newChannel) {
		const channel = await this.client.channels.cache.get(player.textChannel);

		if (!newChannel) {
			await player.destroy();
			return channel.send({ content: 'Music stopped as I have been disconnected from the voice channel.' });
		} else {
			player.voiceChannel = newChannel;
		}
	}

};
