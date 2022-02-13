const Event = require('../../Structures/Event');
const { Formatters } = require('discord.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player) {
		player.timeout = setTimeout(async () => {
			const channel = await this.client.channels.cache.get(player.textChannel);
			channel.send({ content: `I left ${Formatters.channelMention(player.voiceChannel)} because I was inactive for too long.` });

			player.destroy();
		}, 300_000);
	}

};
