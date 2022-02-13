const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(channel) {
		if (channel.type === 'GUILD_VOICE') {
			if (channel.members.has(this.client.user.id)) {
				const player = this.client.manager.players.get(channel.guild.id);
				if (!player) return;

				if (channel.id === player.voiceChannel) {
					player.destroy();
				}
			}
		}
	}

};
