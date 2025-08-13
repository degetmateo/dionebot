import { embedLength, MessageFlags } from "discord.js";
import SuccessEmbed from "../../embeds/successEmbed";
import BChatInputCommandInteraction from "../../extensions/interaction";
import postgres from "../../database/postgres";
import GenericError from "../../errors/genericError";

export default class ShowScoresCommandInteraction {
    private interaction: BChatInputCommandInteraction;

    constructor (interaction: BChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        // await this.interaction.reply({
        //     embeds: [new SuccessEmbed('Espere...')],
        //     flags: [MessageFlags.Ephemeral]
        // });

        await this.interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        
        const enabled = this.interaction.options.getBoolean('enabled', true);
    
        await postgres.sql().begin(async transaction => {
            const qMember = (await transaction`
                SELECT * FROM
                    member
                WHERE
                    discord_id = ${this.interaction.user.id};
            `)[0];

            if (!qMember) throw new GenericError('No estás registrado. Usa \`/setup\`.');

            const qMembership = (await transaction`
                SELECT * FROM
                    membership
                WHERE
                    member_discord_id = ${this.interaction.user.id} AND
                    guild_discord_id = ${this.interaction.guild.id};
            `)[0];

            if (!qMembership) {
                (await transaction`
                    INSERT INTO
                        membership (
                            member_discord_id, 
                            guild_discord_id,
                            scores
                        )
                        VALUES (
                            ${this.interaction.user.id},
                            ${this.interaction.guild.id},
                            ${enabled ? 'ENABLED' : 'DISABLED'}
                        );
                `);
            } else {
                (await transaction`
                    UPDATE 
                        membership
                    SET
                        scores = ${enabled ? 'ENABLED' : 'DISABLED'}
                    WHERE
                        member_discord_id = ${this.interaction.user.id} AND
                        guild_discord_id = ${this.interaction.guild.id};
                `);
            };
        });

        await this.interaction.editReply({
            embeds: [new SuccessEmbed(enabled ? 'Ahora tus puntuaciones se mostrarán en este servidor.' : 'Ahora tus puntuaciones NO se mostrarán en este servidor.')]
        });
    };
};  