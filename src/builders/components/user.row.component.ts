import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class UserRowComponent extends ActionRowBuilder<ButtonBuilder> {
    constructor (data: {
        id: string;
        profile: boolean;
        anilist: boolean;
        mal: boolean;
        vndb: boolean;
    }) {
        super();

        if (data.anilist) {
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-anilist-button_${data.id}`)
                    .setLabel('ANILIST')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.mal) {
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-mal-button_${data.id}`)
                    .setLabel('MAL')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.vndb) {
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-vndb-button_${data.id}`)
                    .setLabel('VNDB')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.profile) {
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-default-button_${data.id}`)
                    .setLabel('PERFIL')
                    .setStyle(ButtonStyle.Primary)
            );
        };
    };
};