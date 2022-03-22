const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Interaction = require('./Interaction');
const Command = require('./Command');
const Event = require('./Event');

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	checkOwner(userId) {
		return this.client.owners.includes(userId);
	}

	formatArray(array, { style = 'short', type = 'conjunction' } = {}) {
		return new Intl.ListFormat('en-US', { style, type }).format(array);
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	formatPermissions(permissions) {
		return permissions.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (string) => string.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/To|And|In\b/g, (string) => string.toLowerCase())
			.replace(/ Instant| Embedded/g, '')
			.replace(/Guild/g, 'Server')
			.replace(/Moderate/g, 'Timeout')
			.replace(/Tts/g, 'Text-to-Speech')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	truncateString(string, maxLen = 100) {
		let i = string?.lastIndexOf(' ', maxLen);
		if (i > maxLen - 3) {
			i = string?.lastIndexOf(' ', i - 1);
		}
		return string?.length > maxLen ? `${string.substring(0, i)}...` : string;
	}

	getCommandName(interaction) {
		let command;
		const commandName = interaction.name;
		const subCommandGroup = interaction._group;
		const subCommand = interaction._subcommand;

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

	async loadInteractions() {
		return glob(`${this.directory}Commands/Interaction/**/*.js`).then(interactions => {
			for (const interactionFile of interactions) {
				delete require.cache[interactionFile];
				const { name } = path.parse(interactionFile);
				const File = require(interactionFile);
				if (!this.isClass(File)) throw new TypeError(`Interaction ${name} doesn't export a class.`);
				const interaction = new File(this.client, name);
				if (!(interaction instanceof Interaction)) throw new TypeError(`Interaction ${name} doesn't belong in Interactions directory.`);
				this.client.interactions.set(this.getCommandName(interaction), interaction);
			}
		});
	}

	async loadCommands() {
		return glob(`${this.directory}Commands/Message/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands directory.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args) => event.run(...args));
			}
		});
	}

};
