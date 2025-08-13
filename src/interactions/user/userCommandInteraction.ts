import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import SuccessEmbed from "../../embeds/successEmbed";
import postgres from "../../database/postgres";
import GenericError from "../../errors/genericError";
import searchUser from "./searchUser";
import UserEmbed from "../../embeds/userEmbed";
import AnilistUser from "../../models/anilist/anilistUser";

export default class UserCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        // await this.interaction.reply({
        //     embeds: [new SuccessEmbed('Espere...')]
        // });

        await this.interaction.deferReply();

        const memberId = this.interaction.options.getUser('member')?.id || this.interaction.user.id;

        const member = (await postgres.sql()`
            SELECT * FROM member WHERE discord_id = ${memberId};
        `)[0];

        if (!member) throw new GenericError(`<@${memberId}> no está registrado.`);

        const user = await searchUser(member.anilist_id);

        await this.interaction.editReply({
            embeds: [new UserEmbed(new AnilistUser(user))]
        });
    };
};