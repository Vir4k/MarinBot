const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Configuration.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.inGuild() && !interaction.isCommand()) return;
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Support Server')
				.setURL(`https://discord.gg/${Access.InviteCode}`));

		const command = this.client.interactions.get(interaction.commandName);
		if (command) {
			try {
				await command.run(interaction);
			} catch (error) {
				this.client.logger.log({ content: error.stack, type: 'error' });
				return await interaction.reply({ content: `Something went wrong, please report it to our **guild support**!`, components: [button], ephemeral: true });
			}
		}
	}

};
