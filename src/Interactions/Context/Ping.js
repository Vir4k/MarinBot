const Interaction = require('../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'Ping',
			type: 'MESSAGE'
		});
	}

	async run(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const latency = Math.round(Date.now() - interaction.createdTimestamp);

		if (latency < 0) {
			return interaction.editReply({ content: 'Please try again later!', ephemeral: true });
		} else {
			return interaction.editReply({ content: [
				`💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping)}ms\``,
				`⏱️ ***Latency:*** \`${latency}ms\``
			].join('\n'), ephemeral: true });
		}
	}

};
