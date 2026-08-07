import { ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, TextDisplayBuilder } from "discord.js";
import Helpers from "../helpers";

type GachaTradeFinishCardComponentData = {
    interactionUserID: string;
    optionsUserID: string;

    aCharacterName: string;
    bCharacterName: string;
    aCharacterImageURL: string;
    bCharacterImageURL: string;
};

export default class GachaTradeFinishCardComponent extends ContainerBuilder {
    constructor (data: GachaTradeFinishCardComponentData) {
        super();

        this.setAccentColor(Helpers.getRandomRGBTuple())

        this.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `### 🤝 ¡Intercambio completado!\n`+
                    `▸ <@${data.interactionUserID}> ahora posee a \`${data.bCharacterName}\`.\n`+
                    `▸ <@${data.optionsUserID}> ahora posee a \`${data.aCharacterName}\`.`
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
    };
};