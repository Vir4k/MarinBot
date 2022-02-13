const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(guild) {
		const player = this.client.manager.players.get(guild.id);
		if (!player) return;

		if (guild.id === player.guild) {
			player.destroy();
		}
	}

};
