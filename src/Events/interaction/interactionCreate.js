const Event = require('../../Structures/Event');
const { Collection } = require('discord.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.inGuild()) return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;

		const command = this.client.interactions.get(this.getCommandName(interaction));
		if (command) {
			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPermissions ? this.client.defaultPermissions.add(command.memberPermissions) : this.client.defaultPermissions;
				if (memberPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.member).missing(memberPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPermissions ? this.client.defaultPermissions.add(command.clientPermissions) : this.client.defaultPermissions;
				if (clientPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}
			}

			if (!this.client.cooldowns.has(this.getCommandName(interaction))) {
				this.client.cooldowns.set(this.getCommandName(interaction), new Collection());
			}

			const current = Date.now();
			const cooldown = this.client.cooldowns.get(this.getCommandName(interaction));
			const duration = command.cooldown;

			if (cooldown.has(interaction.user.id) && !this.client.utils.checkOwner(interaction.user.id)) {
				const expiration = cooldown.get(interaction.user.id) + duration;

				if (current < expiration) {
					const time = (expiration - current) / 1000;
					return interaction.reply({ content: `You've to wait **${time.toFixed(2)}** second(s) to continue.`, ephemeral: true });
				}
			}

			cooldown.set(interaction.user.id, current);
			setTimeout(() => cooldown.delete(interaction.user.id), duration);

			try {
				await command.run(interaction);
			} catch (error) {
				if (interaction.replied) return;
				this.client.logger.log(error.stack, { type: 'error' });

				if (interaction.deferred) {
					return interaction.editReply({ content: `An unexpected error occurred.` });
				} else {
					return interaction.reply({ content: `An unexpected error occurred.`, ephemeral: true });
				}
			}
		}
	}

	getCommandName(interaction) {
		let command;
		// eslint-disable-next-line prefer-destructuring
		const commandName = interaction.commandName;
		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (subCommandGroup) {
				command = `${commandName}-${subCommandGroup}-${subCommand}`;
			} else {
				command = `${commandName}-${subCommand}`;
			}
		} else {
			command = commandName;
		}
		return command;
	}

};
