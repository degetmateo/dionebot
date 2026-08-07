import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SectionBuilder, TextDisplayBuilder } from "discord.js";
import Helpers from "../helpers";

type GachaTradeConfirmCardComponentData = {
    id: string;
    aCharacterName: string;
    bCharacterName: string;
    aCharacterImageURL: string;
    bCharacterImageURL: string;
};

export default class GachaTradeConfirmCardComponent extends ContainerBuilder {
    constructor (data: GachaTradeConfirmCardComponentData) {
        super();
        
        this.setAccentColor(Helpers.getRandomRGBTuple())

        this.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `### Confirmar Intercambio\n`+
                    `Vas a dar a \`${data.aCharacterName}\` a cambio de \`${data.bCharacterName}\`.\n`+
                    `¿Estás seguro de que quieres realizar este intercambio?`
                )
        );

        this.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(data.aCharacterImageURL),
                    new MediaGalleryItemBuilder()
                        .setURL(data.bCharacterImageURL)
                )
        );

        this.addActionRowComponents((builder) =>
            builder
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`gacha-trade-confirm-button_${data.id}`)
                        .setLabel('Confirmar intercambio')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)
                )
        );
    };
};