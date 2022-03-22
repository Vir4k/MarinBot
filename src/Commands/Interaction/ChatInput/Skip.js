const Interaction = require('../../../Structures/Interaction');
const { GuildMember } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'skip',
			description: 'Skips to the next song.',
			type: ApplicationCommandType.ChatInput,
			options: [{
				name: 'number',
				description: 'Position in queue to skip to.',
				type: ApplicationCommandOptionType.Integer,
				required: false
			}],
			clientPermissions: ['CONNECT', 'SPEAK']
		});
	}

	async run(interaction) {
		const number = interaction.options.getInteger('number');
		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return interaction.reply({ content: 'You\'re not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return interaction.reply({ content: 'You\'re not in the same voice channel!', ephemeral: true });
		}

		const player = this.client.manager.players.get(interaction.guildId);
		if (!player || !player.playing) return interaction.reply({ content: '❌ | No music is being played!', ephemeral: true });
		if (player.queue.length < 1) return interaction.reply({ content: '❌ | No more songs in the queue to skip.', ephemeral: true });

		const { current } = player.queue;
		if (!isNaN(number) && number < player.queue.length) {
			await player.stop(number);
		} else {
			await player.stop();
		}
		return interaction.reply({ content: `⏩ | Skipped **${current.title}**!` });
	}

};
