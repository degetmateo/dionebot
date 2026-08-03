import { ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import Helpers from "../helpers";

export type CharacterClaimCardComponentData = {
    id: number;
    name: string;
    url: string;
    image: {
        url: string;
    };

    media: {
        id: number;
        title: {
            userPreferred: string;
        };
        siteUrl: string
    } | null;

    fav_count: number;
    claimed_count: number;

    owner_id: string | null;
    interaction_id: string;

    users_who_want?: string[];
};

class CharacterClaimCardComponent extends ContainerBuilder {
    constructor (data: CharacterClaimCardComponentData) {
        super();
        this.setAccentColor(Helpers.getRandomRGBTuple());

        const characterName = new TextDisplayBuilder().setContent(`### [**${data.name}**](${data.url})`);
        this.addTextDisplayComponents(characterName);
        
        if (data.media) {
            const characterMedia = new TextDisplayBuilder().setContent(`[${data.media.title.userPreferred}](${data.media.siteUrl})`);
            this.addTextDisplayComponents(characterMedia);
        };
        
        const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true);
        this.addSeparatorComponents(separator);
        
        let characterInfoContent = '';

        if (data.owner_id) {
            characterInfoContent +=
                `Pertenece a <@${data.owner_id}>\n`;
        };

        characterInfoContent +=
            `Favoritos: \`${data.fav_count}\`\n` +
            `Claims: \`${data.claimed_count}\`\n`;

        if (data.users_who_want && data.users_who_want.length > 0) {
            characterInfoContent +=
                `Deseado por: ${data.users_who_want.map(i => `<@${i}>`).join(' ')}`;
        };

        const characterInfo = new TextDisplayBuilder().setContent(characterInfoContent);
        this.addTextDisplayComponents(characterInfo);
        
        const characterPortrait = new MediaGalleryBuilder();
        this.addMediaGalleryComponents(characterPortrait);

        const characterImage = new MediaGalleryItemBuilder().setURL(data.image.url);
        characterPortrait.addItems(characterImage);

        const buttons: ButtonBuilder[] = [];

        if (data.owner_id) {
            buttons.push(
                new ButtonBuilder()
                    .setEmoji('💰')
                    .setLabel('Recompensa')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`renas-button_${data.interaction_id}`)
            );
        } else {
            buttons.push(
                new ButtonBuilder()
                    .setEmoji('✋')
                    .setLabel('Reclamar')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`claim-button_${data.interaction_id}`)
            );
        };

        // buttons.push(
        //     new ButtonBuilder()
        //         .setEmoji('💘')
        //         .setLabel('Lo quiero')
        //         .setStyle(ButtonStyle.Secondary)
        //         .setCustomId(`fav-button_${data.interaction_id}`)
        // );

        this.addActionRowComponents(row => 
            row.addComponents(buttons)
        );
    };
};

export default CharacterClaimCardComponent;