const Event = require('../../Structures/Event');
const { Formatters } = require('discord.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player, track) {
		const channel = await this.client.channels.cache.get(player.textChannel);
		channel.send({ content: `▶ | Started playing: **${track.title}** in ${Formatters.channelMention(player.voiceChannel)}!` });

		if (player.timeout !== null) return clearTimeout(player.timeout);
	}

};
