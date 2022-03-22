const { Permissions } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = class Interaction {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.type = options.type || ApplicationCommandType.ChatInput;
		this.description = this.type === ApplicationCommandType.ChatInput ? options.description || 'No description provided.' : undefined;
		this.options = options.options || [];
		this.defaultPermission = options.defaultPermission || undefined;
		this.memberPermissions = new Permissions(options.memberPermissions).freeze();
		this.clientPermissions = new Permissions(options.clientPermissions).freeze();
		this.cooldown = options.cooldown || 3000;
		this.guildOnly = options.guildOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.disabled = options.disabled || false;

		this._group = null;
		this._subcommand = null;
		this._hoistedOptions = this.options;

		if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
			this._group = this._hoistedOptions[0].name;
			this._hoistedOptions = this._hoistedOptions[0].options || [];
		}

		if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.Subcommand) {
			this._subcommand = this._hoistedOptions[0].name;
			this._hoistedOptions = this._hoistedOptions[0].options || [];
		}
	}

	// eslint-disable-next-line no-unused-vars
	async run(interaction) {
		throw new Error(`Interaction ${this.name} doesn't provide a run method!`);
	}

};
