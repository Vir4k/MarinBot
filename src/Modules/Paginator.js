const { DMChannel, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } = require('discord.js');

module.exports = class Paginator {

	constructor(channel = TextChannel || DMChannel, pages = Array(MessageEmbed), timeout = Number) {
		this.message = Message;
		this.index = 0;
		this.channel = channel;
		this.pages = pages.map((page, index) => {
			if (page.footer && (page.footer.text || page.footer.iconURL)) return page;
			return page.setFooter(`Page ${index + 1} of ${pages.length}`);
		});
		this.timeout = timeout;
	}

	async spawn() {
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('first')
				.setEmoji('⏮️'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('prev')
				.setEmoji('◀️'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('next')
				.setEmoji('▶️'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('last')
				.setEmoji('⏭️'));

		this.message = await this.channel.send({ embeds: [this.pages[this.index]], components: [button] });

		if (this.pages.length < 2) return;

		const collector = this.message?.createMessageComponentCollector({ componentType: 'BUTTON', max: this.pages.length * 5 });
		setTimeout(async () => {
			collector?.stop('Timeout');
			await this?.message?.edit({ components: [] });
		}, this.timeout ? this.timeout : 60000);

		collector.on('collect', async (interaction) => {
			switch (interaction.customId) {
				case 'first':
					if (this.index !== 0) {
						this.index = 0;
						await interaction.update({ embeds: [this.pages[this.index]] });
					}
					break;
				case 'prev':
					this.index--;
					if (this.index <= 0) this.index = this.pages.length - 1;
					await interaction.update({ embeds: [this.pages[this.index]] });
					break;
				case 'next':
					this.index++;
					if (this.index >= this.pages.length) {
						this.index = 0;
					}
					await interaction.update({ embeds: [this.pages[this.index]] });
					break;
				case 'last':
					if (this.index !== this.pages.length - 1) {
						this.index = this.pages.length - 1;
						await interaction.update({ embeds: [this.pages[this.index]] });
					}
					break;
			}
		});

		collector.on('end', async () => {
			await this?.message?.edit({ components: [] });
		});
	}

};
