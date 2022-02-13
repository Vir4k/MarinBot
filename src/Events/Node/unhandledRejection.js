const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: process
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(reason, promise) {
		this.client.logger.log(reason.stack ? reason.stack : reason, { type: 'error' });
	}

};
