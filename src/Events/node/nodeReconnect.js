const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(node) {
		this.client.logger.log({ content: `Reconnected to ${node.options.identifier}!`, type: 'ready' });
	}

};
