const Interaction = require('../../../Structures/Interaction');
const { GuildMember } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'resume',
			description: 'Resume the music',
			clientPermissions: ['CONNECT', 'SPEAK']
		});
	}

	async run(interaction) {
		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		const player = this.client.manager.players.get(interaction.guildId);
		if (!player) return interaction.reply({ content: '❌ | No music is being played!', ephemeral: true });
		if (!player.paused) return interaction.reply({ content: '❌ | The music is not paused!', ephemeral: true });

		await player.pause(false);
		return interaction.reply({ content: '▶ | Resumed!' });
	}

};
