import { ButtonInteraction, User } from "discord.js";
import ErrorEmbed from "../../../embeds/errorEmbed";
import Aniuser from "../../../apis/anilist/models/aniuser";
import anilist from "../../../apis/anilist/anilist";
import UserAnilistEmbed from "../../../builders/embeds/user/user.anilist.embed";
import Bot from "../../../bot/bot";
import UserRowComponent from "../../../builders/components/user.row.component";

module.exports = {
    id: 'user-anilist-button',
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

        if (!data.embeds['anilist']) {
            const aniuser = new Aniuser(await anilist.authorized.get.user(data.member.anilist.id, data.member.anilist.token));
            data.embeds['anilist'] = new UserAnilistEmbed(aniuser);
        };

        const bot = interaction.client as Bot;
        bot.update(data.key, data, 60_000);

        const buttons = new UserRowComponent({
            id: data.key,
            anilist: false,
            mal: data.member.mal,
            vndb: data.member.vndb,
            profile: true
        });

        await interaction.update({
            embeds: [data.embeds['anilist']],
            components: buttons.isValid() ? [buttons] : []
        });
    }
};