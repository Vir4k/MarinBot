const Interaction = require('../../../Structures/Interaction');
const { GuildMember, MessageEmbed } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v9');
const { Colors } = require('../../../Utils/Constants');
const Progress = require('../../../Modules/Progress');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'now',
			description: 'Display the playing track.',
			type: ApplicationCommandType.ChatInput,
			options: [{
				name: 'playing',
				description: 'Display the playing track.',
				type: ApplicationCommandOptionType.Subcommand
			}],
			clientPermissions: ['SPEAK']
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
		if (!player || !player.playing) return interaction.reply({ content: '❌ | No music is being played!', ephemeral: true });

		const track = player.queue.current;
		const duration = track.duration > 6.048e+8 ? '🔴 LIVE' : moment.duration(track.duration).format('hh:mm:ss', { stopTrim: 'm' });

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setTitle('🎶 | Now Playing')
			.setDescription([
				`[${track.title}](${track.uri})`,
				`***Requested by:*** <@${track.requester.id}>`
			].join('\n'))
			.addField('\u200b', [
				`${new Progress(track.duration > 6.048e+8 ? player.position : track.duration, player.position, 20)}`,
				`\`${moment.duration(player.position).format('hh:mm:ss', { stopTrim: 'm' })} / ${duration}\``
			].join('\n'));

		return interaction.reply({ embeds: [embed] });
	}

};
