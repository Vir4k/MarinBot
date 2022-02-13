const Interaction = require('../../../Structures/Interaction');
const { GuildMember } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'loop',
			description: 'Changes the looping mode',
			clientPermissions: ['SPEAK']
		});
	}

	async run(interaction) {
		const mode = interaction.options.getString('mode', true);
		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		const player = this.client.manager.players.get(interaction.guildId);
		if (!player || !player.playing) return interaction.reply({ content: '❌ | No music is being played!', ephemeral: true });

		switch (mode) {
			case 'track':
				player.setTrackRepeat(true);
				return interaction.reply({ content: 'Enable track repeat!' });
			case 'queue':
				player.setQueueRepeat(true);
				return interaction.reply({ content: 'Enable queue repeat!' });
			case 'disable':
				if (player.trackRepeat) {
					player.setTrackRepeat(false);
					return interaction.reply({ content: 'Disable track repeat!' });
				} else if (player.queueRepeat) {
					player.setQueueRepeat(false);
					return interaction.reply({ content: 'Disable queue repeat!' });
				}
		}
	}

};
