import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import AnimeEmbed from "../../embeds/animeEmbed";

export default class AnimeCarrousel {
    private interaction: ChatInputCommandInteraction;
    private embeds: EmbedBuilder[];
    private index: number;

    constructor (interaction: ChatInputCommandInteraction, media: any[]) {
        this.interaction = interaction;
        this.embeds = new Array<EmbedBuilder>();
        this.embeds = media.map(m => new AnimeEmbed(m));
        this.index = 0;
    };

    async execute () {
        const row = new ActionRowBuilder<ButtonBuilder>();
        const backButton = new ButtonBuilder()
            .setCustomId('back')
            .setLabel('←')
            .setStyle(ButtonStyle.Primary);
        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('→')
            .setStyle(ButtonStyle.Primary);
        row.addComponents(backButton, nextButton);

        const response = await this.interaction.channel.send({
            embeds: [this.embeds[this.index]],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({
            time: 300000
        });

        collector.on('collect', async (button) => {
            try {
                if (button.customId === 'next') {
                    this.index++;
                    if (this.index > this.embeds.length - 1) {
                        this.index = 0;
                    };
                };
    
                if (button.customId === 'back') {
                    this.index--;
                    if (this.index < 0) {
                        this.index = this.embeds.length - 1;
                    };
                };

                if (button.replied || button.deferred) {
                    await button.editReply({
                        embeds: [this.embeds[this.index]],
                        components: [row]
                    });
                } else {
                    await button.update({
                        embeds: [this.embeds[this.index]],
                        components: [row]
                    });
                };
            } catch (error) {
                console.error(error);
            };
        });
    };
};