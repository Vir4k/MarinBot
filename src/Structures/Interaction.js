module.exports = class Interaction {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.type = options.type || 1;
		this.description = this.type === 1 ? options.description || 'No description provided' : undefined;
		this.options = options.options || [];
		this.defaultPermission = options.defaultPermission;
	}

	// eslint-disable-next-line no-unused-vars
	async run(interaction) {
		throw new Error(`Interaction ${this.name} doesn't provide a run method!`);
	}

};
