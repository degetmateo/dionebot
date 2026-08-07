import { ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, TextDisplayBuilder } from "discord.js";
import Helpers from "../helpers";

type GachaTradeAcceptCardComponentData = {
    id: string;
    interactionUserID: string;
    optionsUserID: string;
    aCharacterName: string;
    bCharacterName: string;
    aCharacterImageURL: string;
    bCharacterImageURL: string;
};

export default class GachaTradeAcceptCardComponent extends ContainerBuilder {
    constructor (data: GachaTradeAcceptCardComponentData) {
        super();

        this.setAccentColor(Helpers.getRandomRGBTuple())

        this.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `### <@${data.optionsUserID}> ¡Puedes aceptar este intercambio!\n`+
                    `<@${data.interactionUserID}> te ha ofrecido un intercambio:\n`+
                    `▸ Recibirás a \`${data.aCharacterName}\` a cambio de \`${data.bCharacterName}\`.\n`+
                    `¿Quieres aceptarlo?`
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
                        .setCustomId(`gacha-trade-accept-button_${data.id}`)
                        .setLabel('Aceptar intercambio')
                        .setEmoji('🤝')
                        .setStyle(ButtonStyle.Success)
                )
        );
    };
};