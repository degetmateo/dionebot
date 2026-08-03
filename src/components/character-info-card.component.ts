import { ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import Helpers from "../helpers";

export type CharacterInfoCardComponentData = {
    id: number;
    name: string;
    url: string;
    image: {
        url: string;
    };

    media: {
        id: number;
        title: string;
        siteUrl: string
    };

    fav_count: number;
    claimed_count: number;

    gender: string | null;
    age: string | null;
    bloodType: string | null;

    owner_id: string | null;
    interaction_id: string;

    users_who_want?: string[];
};

class CharacterInfoCardComponent extends ContainerBuilder {
    constructor (data: CharacterInfoCardComponentData) {
        super();
        this.setAccentColor(Helpers.getRandomRGBTuple());

        const characterName = new TextDisplayBuilder().setContent(`### [**${data.name}**](${data.url})`);
        this.addTextDisplayComponents(characterName);
        
        const characterMedia = new TextDisplayBuilder().setContent(`[${data.media.title}](${data.media.siteUrl})`);
        this.addTextDisplayComponents(characterMedia);
        
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

        if (data.gender) {
            characterInfoContent +=
                `Género: \`${data.gender}\`\n`;
        };

        if (data.age) {
            characterInfoContent +=
                `Edad: \`${data.age}\`\n`;
        };

        if (data.bloodType) {
            characterInfoContent +=
                `Sangre: \`${data.bloodType}\`\n`;
        };

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

        buttons.push(
            new ButtonBuilder()
                .setEmoji('💘')
                .setLabel('Lo quiero')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`fav-button_${data.interaction_id}`)
        );

        this.addActionRowComponents(row => 
            row.addComponents(buttons)
        );
    };
};

export default CharacterInfoCardComponent;