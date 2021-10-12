const Interaction = require('../../../Structures/Interaction.js');
const { GuildMember } = require('discord.js');

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

		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return await interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return await interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		if (interaction.member.voice.channel.full && !interaction.member.voice.channel) {
			return await interaction.reply({ content: 'I can\'t join because the channel is full!', ephemeral: true });
		}

		await interaction.deferReply();
		let player, result;
		try {
			player = this.client.manager.create({
				guild: interaction.guildId,
				voiceChannel: interaction.member.voice.channelId,
				textChannel: interaction.channelId,
				selfDeafen: true,
				volume: 100
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
			return await interaction.editReply({ content: 'There was an error while searching!' });
		}

		switch (result.loadType) {
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy();
				return await interaction.editReply({ content: 'No results were found!' });
			case 'PLAYLIST_LOADED':
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks);

				if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length) await player.play();
				return await interaction.editReply({ content: `🎶 | Playlist **${result.tracks.title}** queued!` });
			default:
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size) await player.play();
				return await interaction.editReply({ content: `🎶 | Track **${result.tracks[0].title}** queued!` });
		}
	}

};
