const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(oldState, newState) {
		const player = await this.client.manager?.players.get(newState.guild.id);
		if (!player) return;

		if (!oldState.guild.me.voice.channel?.members.size || oldState.guild.me.voice.channel?.members.size === 1) {
			const channel = await this.client.channels.cache.get(player.textChannel);

			setTimeout(async () => {
				try { // eslint-disable-next-line no-unused-expressions
					await player ? player.destroy() : oldState.guild.me.voice.channel.leave();
					return channel.send({ content: `I left **${oldState.guild.me.voice.channel.name}** because I was inactive for too long.` }).then(msg => {
						setTimeout(() => msg.delete(), 1000 * 30);
					});
				} catch (error) {
					this.client.logger.log({ content: error.stack, type: 'error' });
				}
			}, 1000 * 60);
		}
	}

};
