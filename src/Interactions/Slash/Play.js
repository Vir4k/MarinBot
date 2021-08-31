const Interaction = require('../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'play',
			description: 'Play a song in your voice channel',
			options: [
				{ type: 'STRING', name: 'query', description: 'A search term or a link', required: true }
			]
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('query', true);
		await interaction.deferReply();

		if (!interaction.member?.voice.channel) return interaction.followUp({ content: 'You need to join a voice channel.', ephemeral: true });

		let res;
		try {
			res = await this.client.manager.search(search, interaction.user);
			if (res.loadType === 'LOAD_FAILED') throw res.exception;
			else if (res.loadType === 'PLAYLIST_LOADED') throw { message: 'Playlists are not supported with this command.' };
		} catch (err) {
			return interaction.followUp({ content: `There was an error while searching: ${err.message}`, ephemeral: true });
		}

		if (res.loadType === 'NO_MATCHES') return interaction.followUp({ content: 'There was no tracks found with that query.', ephemeral: true });

		const player = this.client.manager.create({
			guild: interaction.guildId,
			voiceChannel: interaction.member.voice.channelId,
			textChannel: interaction.channelId,
			selfDeafen: true
		});

		player.connect();
		player.queue.add(res.tracks[0]);

		if (!player.playing && !player.paused && !player.queue.size) player.play();

		return interaction.editReply({ content: `Enqueuing ${res.tracks[0].title}.` });
	}

};
