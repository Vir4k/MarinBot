const Event = require('../../Structures/Event');
const { Collection } = require('discord.js');

module.exports = class extends Event {

	async run(message) {
		if (!message.inGuild() || message.author.bot) return;

		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.content.match(mentionRegex)) {
			return message.reply({ content: `Hi, my prefix for this server is \`${this.client.prefix}\`.` });
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.disabled && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply({ content: 'This command is currently inaccessible!' });
			}

			if (message.inGuild()) {
				const memberPermCheck = command.memberPermissions ? this.client.defaultPermissions.add(command.memberPermissions) : this.client.defaultPermissions;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						return message.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.` });
					}
				}

				const clientPermCheck = command.clientPermissions ? this.client.defaultPermissions.add(command.clientPermissions) : this.client.defaultPermissions;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return message.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.` });
					}
				}
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply({ content: 'This command is only accessible for developers!' });
			}

			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			const current = Date.now();
			const cooldown = this.client.cooldowns.get(command.name);
			const duration = command.cooldown;

			if (cooldown.has(message.author.id) && !this.client.utils.checkOwner(message.author.id)) {
				const expiration = cooldown.get(message.author.id) + duration;

				if (current < expiration) {
					const time = (expiration - current) / 1000;
					return message.reply({ content: `You've to wait **${time.toFixed(2)}** second(s) to continue.` })
						.then(m => setTimeout(() => m.delete(), expiration - current));
				}
			}

			cooldown.set(message.author.id, current);
			setTimeout(() => cooldown.delete(message.author.id), duration);

			try {
				await message.channel.sendTyping();
				await command.run(message, args);
			} catch (error) {
				this.client.logger.log(error.stack ? error.stack : error, { type: 'error' });
				return message.reply({ content: 'An unexpected error occurred.' });
			}
		}
	}

};
