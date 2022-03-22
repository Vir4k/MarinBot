/* eslint-disable camelcase */
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const inquirer = require('inquirer');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const interaction = [];

(async () => {
	await glob('src/Commands/Interaction/**/*.js').then(commands => {
		for (const commandFiles of commands) {
			const { name } = path.parse(commandFiles);
			const File = require(`../${commandFiles}`);
			const command = new File(null, name);
			interaction.push(command);
		}
	});

	// eslint-disable-next-line prefer-const
	let { type, clientId, guildId, token } = await inquirer.prompt([{
		type: 'rawlist',
		name: 'type',
		message: 'Select register type:',
		choices: [{
			name: 'Guild',
			value: 'guild'
		}, {
			name: 'Global',
			value: 'global'
		}]
	}, {
		type: 'input',
		name: 'clientId',
		message: 'Enter the client id:',
		default: process.env.CLIENT_ID,
		validate: (value) => {
			if (!value) return 'Please enter a client id';
			return true;
		}
	}, {
		type: 'input',
		name: 'guildId',
		message: 'Enter the guild id:',
		when: (answer) => answer.type === 'guild',
		validate: (value) => {
			if (!value) return 'Please enter a guild id';
			return true;
		}
	}, {
		type: 'password',
		name: 'token',
		message: 'Enter the bot token:',
		mask: '*',
		when: () => !process.env.DISCORD_TOKEN
	}]);

	if (!token) token = process.env.DISCORD_TOKEN;
	const rest = new REST({ version: '9' }).setToken(token);

	// TODO: Fix merge sub command group

	const commands = new Map(interaction.map(opts => [opts.name, {
		name: opts.name,
		description: opts.description,
		type: opts.type,
		options: [],
		default_permission: opts.defaultPermission
	}]));

	for (const { name, options } of interaction) commands.get(name).options.push(...[options].flat());

	try {
		console.log('Started refreshing application (/) commands.');

		switch (type) {
			case 'guild':
				await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [...commands.values()] });
				break;
			case 'global':
				await rest.put(Routes.applicationCommands(clientId), { body: [...commands.values()] });
				break;
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
