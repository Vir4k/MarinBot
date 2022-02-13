const Event = require('../../Structures/Event');
const youtube = require('youtube-search-api');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate'
		});
	}

	async run(interaction) {
		if (!interaction.isAutocomplete()) return;

		if (interaction.commandName === 'play') {
			const search = interaction.options.getFocused();
			if (search.length === 0) return interaction.respond([]);

			// eslint-disable-next-line new-cap
			const data = await youtube.GetListByKeyword(search, false, 5).then(res => res.items);
			if (data.length === 0) return interaction.respond([]);

			return interaction.respond(data.map(result => ({
				name: this.client.utils.truncateString(result.title, 100),
				value: `https://youtu.be/${result.id}`
			})));
		}
	}

};
