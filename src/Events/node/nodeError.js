const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(node, error) {
		this.client.logger.log({ content: error.stack, type: 'error' });
	}

};
