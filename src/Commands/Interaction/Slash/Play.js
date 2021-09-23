const Interaction = require('../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'play',
			description: 'Play a song in your voice channel',
			options: [
				{ type: 3, name: 'query', description: 'A search term or a link', required: true }
			]
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('query', true);

		if (!interaction.member?.voice.channel) return interaction.reply({ content: 'You need to join a voice channel!', ephemeral: true });
		if (this.client.manager?.players.get(interaction.guildId)) {
			if (interaction.member.voice.channelId !== this.client.manager?.players.get(interaction.guildId).voiceChannel) {
				return interaction.reply({ content: 'You are not in the same voice channel with me.', ephemeral: true });
			}
		}
		if (interaction.member.voice.channel.full && !interaction.member?.voice.channel) {
			return interaction.reply({ content: 'I can\'t join because the channel is full!', ephemeral: true });
		}

		let player, result;
		try {
			player = this.client.manager.create({
				guild: interaction.guildId,
				voiceChannel: interaction.member.voice.channelId,
				textChannel: interaction.channelId,
				selfDeafen: true
			});
		} catch (error) {
			this.client.logger.log({ content: error.stack, type: 'error' });
		}

		try {
			result = await player.search(search, interaction.user);
			if (!result.loadType === 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy();
				this.client.logger.log({ content: result.exception.message || result.exception, type: 'error' });
			}
		} catch (error) {
			this.client.logger.log({ content: error.stack, type: 'error' });
			return interaction.reply({ content: 'There was an error while searching!', ephemeral: true });
		}

		switch (result.loadType) {
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy();
				return interaction.reply({ content: 'No result was found.' });
			case 'PLAYLIST_LOADED':
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks);
				if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length) await player.play();
				return interaction.reply({ content: `Queued **${result.tracks.length}** tracks` });
			default:
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks[0]);
				if (!player.playing && !player.paused && !player.queue.size) {
					await player.play();
					return interaction.reply({ content: 'Successfully started queue.' });
				} else {
					return interaction.reply({ content: `Added to queue: ${result.tracks[0].title}` });
				}
		}
	}

};
