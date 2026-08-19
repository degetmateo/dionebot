import { ButtonInteraction, User } from "discord.js";
import ErrorEmbed from "../../../embeds/errorEmbed";
import mal from "../../../apis/mal/mal";
import UserMALEmbed from "../../../builders/embeds/user/user.mal.embed";
import UserRowComponent from "../../../builders/components/user.row.component";
import Bot from "../../../bot/bot";

module.exports = {
    id: 'user-mal-button',
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

        if (!data.embeds['mal']) {
            const maluser: any = await mal.user.get({ id: data.member.mal.id, token: data.member.mal.auth.access_token });
            
            if (data.member.profile) {
                maluser.color = data.member.profile.color;
            };
            
            data.embeds['mal'] = new UserMALEmbed(maluser);
        };

        const bot = interaction.client as Bot;
        bot.update(data.key, data, 60_000);

        const buttons = new UserRowComponent({
            id: data.key,
            anilist: data.member.anilist,
            mal: false,
            vndb: data.member.vndb,
            profile: true
        });

        await interaction.update({
            embeds: [data.embeds['mal']],
            components: buttons.isValid() ? [buttons] : []
        });
    }
};