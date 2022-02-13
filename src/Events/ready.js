const Event = require('../Structures/Event');
const chalk = require('chalk');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		this.client.manager.init(this.client.user.id);

		this.client.logger.log(`Logged in as ${chalk.redBright(`${this.client.user.tag}`)}`);
		this.client.logger.log(`Loaded ${(this.client.commands.size + this.client.interactions.size).toLocaleString()} commands & ${this.client.events.size.toLocaleString()} events!`);
		this.client.logger.log(`Ready in ${this.client.guilds.cache.size.toLocaleString()} guilds on ${this.client.channels.cache.size.toLocaleString()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users.`);
		this.client.logger.log('Connected to Discord API!', { type: 'ready' });
	}

};
