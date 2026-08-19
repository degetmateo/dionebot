import { ButtonInteraction, User } from "discord.js";
import ErrorEmbed from "../../../embeds/errorEmbed";
import UserProfileEmbed from "../../../builders/embeds/user/user.profile.embed";
import Bot from "../../../bot/bot";
import UserRowComponent from "../../../builders/components/user.row.component";

module.exports = {
    id: 'user-default-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        platform: null | 'ANILIST' | 'MAL' | 'VNDB';
        member: any;
        user: User;
        embeds: {
            default: any;
            anilist: any;
            mal: any;
            vndb: any;
        };
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: 'Ephemeral',
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        if (!data.embeds['default']) {
            data.embeds['default'] = new UserProfileEmbed({ member: data.member, user: data.user });
        };

        const bot = interaction.client as Bot;
        bot.update(data.key, data, 60_000);

        const buttons = new UserRowComponent({
            id: data.key,
            anilist: data.member.anilist,
            mal: data.member.mal,
            vndb: data.member.vndb,
            profile: false
        });

        await interaction.update({
            embeds: [data.embeds['default']],
            components: buttons.isValid() ? [buttons] : []
        });
    }
};