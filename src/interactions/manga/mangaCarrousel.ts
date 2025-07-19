import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionCallbackResponse } from "discord.js";
import MangaEmbed from "../../embeds/mangaEmbed";

export default class MangaCarrousel {
    private response: InteractionCallbackResponse;
    private embeds: EmbedBuilder[];
    private index: number;

    constructor (response: InteractionCallbackResponse, media: any[]) {
        this.response = response;
        this.embeds = new Array<EmbedBuilder>();
        this.embeds = media.map(m => new MangaEmbed(m));
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

        await this.response.resource.message.edit({
            embeds: [this.embeds[this.index]],
            components: [row]
        });

        const collector = this.response.resource.message.createMessageComponentCollector({
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