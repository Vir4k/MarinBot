const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
			emitter: 'manager'
		});
	}

	async run(node) {
		this.client.logger.log({ content: `Connected to ${node.options.identifier}!`, type: 'ready' });
	}

};
