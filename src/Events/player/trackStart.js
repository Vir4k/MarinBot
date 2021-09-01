const Event = require('../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player, track) {
		const channel = await this.client.channels.cache.get(player.textChannel);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor('Now playing')
			.setTitle(track.title)
			.setURL(track.uri)
			.setDescription([
				`***Author:*** ${track.author}`,
				`***Duration:*** ${track.isStream ? 'LIVE STREAM' : moment.duration(track.duration).format('HH:mm:ss')}`,
				`***Queue:*** \`${player.queue.length}\` left`,
				`***Requested by:*** <@${track.requester.id}>`
			].join('\n'))
			.setFooter(`Powered by ${this.client.user.username}`, track.requester.displayAvatarURL({ dynamic: true }));

		return channel.send({ embeds: [embed] });
	}

};
