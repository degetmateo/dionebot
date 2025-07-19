import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import { ModalBuilder, TextInputStyle } from "discord.js";

export default class SetupCollectorModal extends ModalBuilder {
    public static readonly inputId: string = 'inputCode';
    public static readonly modalId: string = 'modalCode';

    constructor () {
        super();

        const input = new TextInputBuilder()
            .setCustomId(SetupCollectorModal.inputId)
            .setLabel('Tu código')
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

        this
            .setCustomId(SetupCollectorModal.modalId)
            .setTitle('Pegá tu código acá')
            .addComponents(row);
    };
};