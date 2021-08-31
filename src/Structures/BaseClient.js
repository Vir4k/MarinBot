const { Client, Collection, Intents } = require('discord.js');
const { Manager } = require('erela.js');
const { Lavalink } = require('../Utils/Configuration.js');
const Util = require('./Util.js');

module.exports = class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES
			],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			},
			failIfNotExists: false
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.interactions = new Collection();
		this.events = new Collection();
		this.utils = new Util(this);

		this.logger = require('../Modules/Logger.js');

		this.manager = new Manager({
			nodes: [Lavalink],
			send: (id, payload) => {
				const guild = this.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
			autoPlay: true
		});

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		const nodeVersion = parseFloat(process.versions.node);
		if (nodeVersion < 16.6) throw new Error('This client requires Node.js v16.6.x or higher.');

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.owners) throw new Error('You must pass a list of owners for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owners should be a type of Array<String>.');
		this.owners = options.owners;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

};
