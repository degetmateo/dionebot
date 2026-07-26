import { ButtonInteraction, User } from "discord.js";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import createUserEmbed from "../../commands/general/execute/user/create.user.embed";
import UserRowComponent from "../../builders/components/user.row.component";

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
            data.embeds['vndb'] = await createUserEmbed('VNDB', data.member, data.user);
        };

        const bot = interaction.client as Bot;
        bot.update(data.key, data, 60_000);

        const buttons = new UserRowComponent({
            id: data.key,
            anilist: data.platform != 'ANILIST' && data.member.anilist,
            mal: data.platform != 'MAL' && data.member.mal,
            vndb: false,
            profile: true
        });

        await interaction.update({
            embeds: [data.embeds['vndb']],
            components: [buttons]
        });
    }
};