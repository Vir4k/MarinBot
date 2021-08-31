const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(player, track) {
		const channel = await this.client.channels.cache.get(player.textChannel);

		if (!player.get('autoplay')) {
			await player.destroy();
			return channel.send({ content: 'No more songs to play. Left the voice channel.' });
		} else {
			const mixURL = `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`;
			const result = await player.search(mixURL, this.client.user);

			if (!result || result.loadType === 'LOAD_FAILED' || result.loadType !== 'PLAYLIST_LOADED') {
				channel.send({ content: 'Music stopped. No related song was found.' });
				return player.destroy();
			}
			player.queue.add(result.tracks[1]);
			return player.play();
		}
	}

};
