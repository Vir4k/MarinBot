const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	// eslint-disable-next-line no-unused-vars
	async run(oldState, newState) {
		const player = await this.client.manager.get(oldState.guild.id);
		if (!player) return;

		const voiceChannel = await this.client.channels.cache.get(player.voiceChannel);
		const channel = await this.client.channels.cache.get(player.textChannel);

		if (oldState && oldState.channel && !voiceChannel.members.filter(x => !x.user.bot).size && player.voiceChannel === oldState.channelId) {
			setTimeout(async () => {
				channel.send({ content: 'I left the voice channel as I was left alone.' });
				return player.destroy();
			}, 60000);
		}
	}

};
