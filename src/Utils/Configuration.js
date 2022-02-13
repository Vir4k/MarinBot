module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.CLIENT_PREFIX,
	owners: process.env.CLIENT_OWNERS?.split(','),
	nodes: process.env.LAVALINK_NODE,
	defaultPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	inviteLink: process.env.INVITE_LINK
};
