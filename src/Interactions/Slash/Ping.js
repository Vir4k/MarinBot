const Interaction = require('../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Gets current latency & API response time'
		});
	}

	async run(interaction) {
		return interaction.reply({ content: [
			`💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`⏱️ ***Latency:*** \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``
		].join('\n'), ephemeral: true });
	}

};
