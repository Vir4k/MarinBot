const { Client, Collection, Intents, Permissions } = require('discord.js');
const { Manager } = require('erela.js');
const Util = require('./Util');
require('./ClientPlayer');

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
			}
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.interactions = new Collection();
		this.cooldowns = new Collection();
		this.utils = new Util(this);

		this.logger = require('../Modules/Logger');

		this.manager = new Manager({
			nodes: JSON.parse(this.nodes),
			send: (id, payload) => {
				const guild = this.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
			autoPlay: true
		});

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
		};

		String.prototype.toSentenceCase = function () {
			return this.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
		};
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		const semver = require('semver/functions/lt');
		if (semver(process.versions.node, '16.6.0')) throw new Error('This client requires Node.js v16.6.0 or higher.');

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners || options.owners[0] === '') throw new Error('You must pass a list of owners for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owners should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions) throw new Error('You must pass default perm(s) for the Client.');
		this.defaultPermissions = new Permissions(options.defaultPermissions).freeze();

		if (!options.nodes) throw new Error('You must pass the lavalink nodes for the Client.');
		this.nodes = options.nodes;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		this.utils.loadInteractions();
		super.login(token);
	}

};
