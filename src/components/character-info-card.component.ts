import { ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, User } from "discord.js";
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
    claimed_count: number | null;

    gender: string | null;
    age: string | null;
    bloodType: string | null;

    owner?: { username: string; } | null;

    interaction_id: string;

    users_who_want?: string[];

    page_buttons?: boolean;
};

class CharacterInfoCardComponent extends ContainerBuilder {
    public character_data: CharacterInfoCardComponentData;
    constructor (data: CharacterInfoCardComponentData) {
        super();
        this.character_data = data;
        this.setAccentColor(Helpers.getRandomRGBTuple());

        const characterName = new TextDisplayBuilder().setContent(`### [**${data.name}**](${data.url})`);
        this.addTextDisplayComponents(characterName);
        
        const characterMedia = new TextDisplayBuilder().setContent(`[${data.media.title}](${data.media.siteUrl})`);
        this.addTextDisplayComponents(characterMedia);
        
        const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true);
        this.addSeparatorComponents(separator);
        
        let characterInfoContent = '';

        if (data.owner) {
            characterInfoContent +=
                `Pertenece a **${data.owner.username}**\n`;
        };

        characterInfoContent +=
            `ID: \`${data.id}\`\n`+
            `Favoritos: \`${data.fav_count}\`\n`;

        if (data.claimed_count) {
            characterInfoContent +=
                `Claims: \`${data.claimed_count}\`\n`;
        };

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

        if (data.page_buttons) {
            buttons.push(
                new ButtonBuilder()
                    .setEmoji('⬅️')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`character-back-button_${data.interaction_id}`),
                new ButtonBuilder()
                    .setEmoji('➡️')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`character-next-button_${data.interaction_id}`),
            )
        };

        buttons.push(
            new ButtonBuilder()
                .setEmoji('💘')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`character-fav-button_${data.interaction_id}`)
        );

        this.addActionRowComponents(row => 
            row.addComponents(buttons)
        );
    };
};

export default CharacterInfoCardComponent;