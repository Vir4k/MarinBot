module.exports = [{
	name: 'loop',
	description: 'Changes the looping mode.',
	type: 'CHAT_INPUT',
	options: [{
		type: 'STRING', name: 'mode', description: 'The new looping mode.', required: true, choices: [
			{ name: 'Track', value: 'track' },
			{ name: 'Queue', value: 'queue' },
			{ name: 'Disable', value: 'disable' }
		]
	}]
}, {
	name: 'now',
	description: 'Display the playing track.',
	type: 'CHAT_INPUT',
	options: [{
		type: 'SUB_COMMAND', name: 'playing', description: 'Display the playing track.'
	}]
}, {
	name: 'pause',
	description: 'Pause the music.',
	type: 'CHAT_INPUT'
}, {
	name: 'ping',
	description: 'Send a ping request.',
	type: 'CHAT_INPUT'
}, {
	name: 'play',
	description: 'Play a song in your voice channel.',
	type: 'CHAT_INPUT',
	options: [{
		type: 'STRING', name: 'input', description: 'A search term or a link.', required: true, autocomplete: true
	}]
}, {
	name: 'resume',
	description: 'Resume the music.',
	type: 'CHAT_INPUT'
}, {
	name: 'skip',
	description: 'Skips to the next song.',
	type: 'CHAT_INPUT',
	options: [{
		type: 'INTEGER', name: 'number', description: 'Position in queue to skip to.', required: false
	}]
}, {
	name: 'stop',
	description: 'Stops the music.',
	type: 'CHAT_INPUT'
}];
