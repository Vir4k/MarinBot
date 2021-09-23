const Interaction = require('../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'pause',
			description: 'Pause the music'
		});
	}

	async run(interaction) {
		await interaction.deferReply();

		const player = this.client.manager.players.get(interaction.guildId);
		if (!player) {
			return interaction.editReply({ content: 'No song is being currently played in this server.' });
		}

		if (!interaction.member?.voice.channel) {
			return interaction.followUp({ content: 'You need to join a voice channel.', ephemeral: true });
		} else if (interaction.member?.voice.channelId !== player.voiceChannel) {
			return interaction.followUp({ content: 'You\'re not in the same voice channel.', ephemeral: true });
		} else if (player.paused) {
			return interaction.followUp({ content: 'Music is already paused.', ephemeral: true });
		}

		player.pause(true);
		return interaction.editReply({ content: 'Music has been paused.' });
	}

};
