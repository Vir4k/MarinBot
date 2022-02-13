const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(d) {
		this.client.manager.updateVoiceState(d);
	}

};
