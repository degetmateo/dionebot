import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class VNRowComponent extends ActionRowBuilder<ButtonBuilder> {
    private buttonBack: ButtonBuilder;
    private buttonNext: ButtonBuilder;

    constructor (id: string) {
        super();

        this.buttonBack = new ButtonBuilder()
            .setCustomId(`vn-button-back_${id}`)
            .setLabel('←')
            .setStyle(ButtonStyle.Primary);
        
        this.buttonNext = new ButtonBuilder()
            .setCustomId(`vn-button-next_${id}`)
            .setLabel('→')
            .setStyle(ButtonStyle.Primary);
        
        this.addComponents(this.buttonBack, this.buttonNext);
    };
};