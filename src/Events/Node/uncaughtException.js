const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: process
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(error, origin) {
		this.client.logger.log(error.stack ? error.stack : error, { type: 'error' });
	}

};
