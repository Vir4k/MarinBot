const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(node) {
		this.client.logger.log(`Reconnecting nodes to ${node.options.identifier}!`, { type: 'debug' });
	}

};
