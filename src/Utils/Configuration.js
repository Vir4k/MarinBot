module.exports = {
	token: process.env.DISCORD_TOKEN,
	owners: process.env.CLIENT_OWNERS.split(','),
	Access: {
		InviteCode: process.env.INVITE_CODE,
		InvitePermission: 3525632,
		InviteScope: ['bot', 'applications.commands']
	},
	Color: {
		DEFAULT: '2f3136'
	},
	Lavalink: {
		identifier: process.env.LAVALINK_ID || 'Lavalink',
		host: process.env.LAVALINK_HOST,
		port: Number(process.env.LAVALINK_PORT),
		password: process.env.LAVALINK_PASSWORD
	}
};
