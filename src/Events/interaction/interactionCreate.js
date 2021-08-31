const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Configuration.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.inGuild()) return interaction.reply({ content: 'Commands can only be used within the guild!', ephemeral: true });
		if (interaction.isCommand()) {
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
					return interaction.reply({ content: `Something went wrong, please report it to our **guild support**!`, components: [button], ephemeral: true });
				}
			}
		}
	}

};
