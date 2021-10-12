const Interaction = require('../../../Structures/Interaction.js');
const { GuildMember } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'stop',
			description: 'Stops the music'
		});
	}

	async run(interaction) {
		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return await interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return await interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		await interaction.deferReply();
		const player = this.client.manager.players.get(interaction.guildId);
		if (!player || !player.playing) return await interaction.editReply({ content: '❌ | No music is being played!' });

		await player.destroy();
		return await interaction.editReply({ content: '🛑 | Stopped the player!' });
	}

};
