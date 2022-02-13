const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(node, error) {
		this.client.logger.log(error.stack ? error.stack : error, { type: 'error' });
	}

};
