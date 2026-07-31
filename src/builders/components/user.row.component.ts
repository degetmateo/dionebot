import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class UserRowComponent extends ActionRowBuilder<ButtonBuilder> {
    private length: number = 0;

    isValid () {
        return this.length >= 1;
    };

    constructor (data: {
        id: string;
        profile: boolean;
        anilist: boolean;
        mal: boolean;
        vndb: boolean;
    }) {
        super();

        if (data.anilist) {
            this.length += 1;
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-anilist-button_${data.id}`)
                    .setLabel('Ver ANILIST')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.mal) {
            this.length += 1;
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-mal-button_${data.id}`)
                    .setLabel('Ver MAL')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.vndb) {
            this.length += 1;
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-vndb-button_${data.id}`)
                    .setLabel('Ver VNDB')
                    .setStyle(ButtonStyle.Primary)
            );
        };

        if (data.profile) {
            this.length += 1;
            this.addComponents(
                new ButtonBuilder()
                    .setCustomId(`user-default-button_${data.id}`)
                    .setLabel('Ver PERFIL')
                    .setStyle(ButtonStyle.Primary)
            );
        };
    };
};