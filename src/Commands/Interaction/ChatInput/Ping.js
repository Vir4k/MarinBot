const Interaction = require('../../../Structures/Interaction');
const { ApplicationCommandType } = require('discord-api-types/v9');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Send a ping request.',
			type: ApplicationCommandType.ChatInput
		});
	}

	async run(interaction) {
		return interaction.reply({ content: [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***REST:*** \`${Math.round(Date.now() - interaction.createdTimestamp)}ms\``
		].join('\n') });
	}

};
