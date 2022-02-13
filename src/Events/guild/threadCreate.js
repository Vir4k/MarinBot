const Event = require('../../Structures/Event');

module.exports = class extends Event {

	// eslint-disable-next-line no-unused-vars
	async run(thread, newlyCreated) {
		try {
			if (thread.joinable && !thread.joined) {
				await thread.join();
			}
		} catch (e) {
			this.client.logger.log(e.stack ? e.stack : e, { type: 'error' });
		}
	}

};
