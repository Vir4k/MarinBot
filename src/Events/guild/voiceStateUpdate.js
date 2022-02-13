const Event = require('../../Structures/Event');
const { Permissions } = require('discord.js');

module.exports = class extends Event {

	async run(oldState, newState) {
		if (newState.channelId && newState.channel.type === 'GUILD_STAGE_VOICE' && newState.guild.me.voice.suppress) {
			if (newState.guild.me.permissions.has(Permissions.FLAGS.SPEAK) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.SPEAK))) {
				newState.guild.me.voice.setSuppressed(false).catch(() => {});
			}
		}

		if (newState.id === this.client.user.id && newState.channelId !== oldState.channelId && !newState.guild.me.voice.deaf) {
			if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
				newState.setDeaf(true).catch(() => {});
			}
		}

		if (newState.id === this.client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
			if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
				newState.setDeaf(true).catch(() => {});
			}
		}
	}

};
