import { ButtonBuilder, ButtonStyle, ContainerBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder, User } from "discord.js";
import Helpers from "../helpers";

type GachaInventoryComponentData = {
    id: string;

    user: User;

    pageNumber: number;
    pageTotal: number;
    showIndex: boolean;

    characters: Array<{
        name: string;
        url: string;
    }>;
};

export default class GachaInventoryComponent extends ContainerBuilder {
    constructor (data: GachaInventoryComponentData) {
        super();

        this.setAccentColor(Helpers.getRandomRGBTuple());

        const avatarURL = data.user.avatarURL({ extension: "png", size: 1024 }) || '';

        this.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`### Personajes de <@${data.user.id}>`)
        );

        this.addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Small)
                .setDivider(true)
        );
        
        const text = data.characters.map(c => `[${c.name}](${c.url})`).join('\n');

        this.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(text)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(avatarURL)
                )
        )

        this.addSeparatorComponents((builder) => 
            builder
                .setSpacing(SeparatorSpacingSize.Small)
                .setDivider(true)
        );

        if (data.showIndex) {
            this.addActionRowComponents(row => 
                row.addComponents(
                    new ButtonBuilder()
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`gacha-inventory-back-button_${data.id}`),
                    new ButtonBuilder()
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`gacha-inventory-next-button_${data.id}`)
                )
            );

            this.addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Página ${data.pageNumber} de ${data.pageTotal}`)
            );
        };
    };
};