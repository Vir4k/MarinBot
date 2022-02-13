const Interaction = require('../../../Structures/Interaction');
const { GuildMember } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'play',
			description: 'Play a song in your voice channel',
			clientPermissions: ['CONNECT', 'SPEAK']
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('input', true);

		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		if (interaction.member.voice.channel.full && !interaction.member.voice.channel) {
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
			this.client.logger.log(error.stack, { type: 'error' });
		}

		try {
			result = await player.search(search, interaction.user);
			if (!result.loadType === 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy();
				throw result.exception;
			}
		} catch (error) {
			this.client.logger.log(error.stack, { type: 'error' });
			return interaction.reply({ content: 'There was an error while searching!', ephemeral: true });
		}

		switch (result.loadType) {
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy();
				return interaction.reply({ content: 'No results were found!', ephemeral: true });
			case 'PLAYLIST_LOADED':
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks);

				if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length) await player.play();
				return interaction.reply({ content: `🎶 | Playlist **${result.tracks.title}** queued!` });
			default:
				if (player.state !== 'CONNECTED') player.connect();
				player.queue.add(result.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size) await player.play();
				return interaction.reply({ content: `🎶 | Track **${result.tracks[0].title}** queued!` });
		}
	}

};
