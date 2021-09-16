module.exports = {
	token: process.env.DISCORD_TOKEN,
	userId: process.env.CLIENT_ID,
	owners: process.env.CLIENT_OWNERS.split(','),
	Access: {
		InviteCode: process.env.INVITE_CODE,
		InvitePermission: 3525632,
		InviteScope: ['bot', 'applications.commands']
	},
	Color: {
		DEFAULT: '2f3136'
	},
	Emoji: {
		ONLINE: '<:online:712397262256472075>',
		IDLE: '<:idle:712397201955094708>',
		DND: '<:dnd:712397154836283392>',
		OFFLINE: '<:offline:712397086100029440>'
	},
	Lavalink: {
		identifier: process.env.LAVALINK_ID || 'Lavalink',
		host: process.env.LAVALINK_HOST,
		port: Number(process.env.LAVALINK_PORT),
		password: process.env.LAVALINK_PASSWORD
	}
};
