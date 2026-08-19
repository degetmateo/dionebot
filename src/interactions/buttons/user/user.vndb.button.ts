import { ButtonInteraction, User } from "discord.js";
import ErrorEmbed from "../../../embeds/errorEmbed";
import vndb from "../../../apis/vndb/vndb";
import UserVNDBEmbed from "../../../builders/embeds/user/user.vndb.embed";
import UserRowComponent from "../../../builders/components/user.row.component";
import Bot from "../../../bot/bot";

module.exports = {
    id: 'user-vndb-button',
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

        if (!data.embeds['vndb']) {
            const vndbuser: any = await vndb.user({ id: data.member.vndb.id, token: data.member.vndb.auth.token });
            vndbuser.name = data.member.vndb.username;
            vndbuser.id = data.member.vndb.id;

            if (data.member.profile) {
                vndbuser.color = data.member.profile.color;
                vndbuser.avatar = data.member.profile.avatar_url;
                vndbuser.banner = data.member.profile.banner_url;
            };

            data.embeds['vndb'] = new UserVNDBEmbed(vndbuser);
        };

        const bot = interaction.client as Bot;
        bot.update(data.key, data, 60_000);

        const buttons = new UserRowComponent({
            id: data.key,
            anilist: data.member.anilist,
            mal: data.member.mal,
            vndb: false,
            profile: true
        });

        await interaction.update({
            embeds: [data.embeds['vndb']],
            components: buttons.isValid() ? [buttons] : []
        });
    }
};