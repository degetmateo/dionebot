import { MessageFlags } from "discord.js";
import postgres from "../../database/postgres";
import LoadingEmbed from "../../embeds/loadingEmbed";
import GenericError from "../../errors/genericError";
import BChatInputCommandInteraction from "../../extensions/interaction";
import SuccessEmbed from "../../embeds/successEmbed";

export default class UnsetupCommandInteraction {
    private interaction: BChatInputCommandInteraction;

    constructor (interaction: BChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        await this.interaction.reply({
            embeds: [new LoadingEmbed()],
            flags: [MessageFlags.Ephemeral]
        });

        await postgres.sql().begin(async transaction => {
            const member = (await transaction`
                SELECT * FROM
                    member
                WHERE
                    discord_id = ${this.interaction.user.id};
            `)[0];

            if (!member) throw new GenericError("No estás registrado.");

            (await transaction`
                DELETE FROM
                    member
                WHERE
                    discord_id = ${this.interaction.user.id};
            `);

            (await transaction`
                DELETE FROM
                    membership
                WHERE
                    member_discord_id = ${this.interaction.user.id};
            `);
        });

        await this.interaction.editReply({
            embeds: [new SuccessEmbed("Eliminé correctamente tu cuenta.")]
        });
    };
};