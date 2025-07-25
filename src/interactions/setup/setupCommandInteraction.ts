import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import GenericError from "../../errors/genericError";
import postgres from "../../database/postgres";
import SuccessEmbed from "../../embeds/successEmbed";
import SetupInstructionsEmbed from "../../embeds/setupInstructionsEmbed";
import searchViewer from "./searchViewer";
import SetupInstructionsRow from "../../components/setupInstructionsRow";
import SetupCollectorModal from "../../components/setupCollectorModal";
import ErrorEmbed from "../../embeds/errorEmbed";

export default class SetupCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        await this.interaction.reply({
            embeds: [new SuccessEmbed('Espere...')],
            flags: [MessageFlags.Ephemeral]
        });

        const member = (await postgres.sql()`
            SELECT * FROM member WHERE discord_id = ${this.interaction.user.id};
        `)[0];

        if (member) throw new GenericError('¡Ya estás registrado! Utilizá \`/show-scores\` para mostrar tus puntuaciones en este servidor.');

        const response = await this.interaction.editReply({
            embeds: [new SetupInstructionsEmbed()],
            components: [new SetupInstructionsRow()]
        });

        const collector = response.createMessageComponentCollector({ time: 180000 });

        collector.on('collect', async collected => {
            if (collected.customId === SetupInstructionsRow.buttonId) {
                await collected.showModal(new SetupCollectorModal());

                const modal = await collected.awaitModalSubmit({ time: 180000 });

                await modal.reply({
                    embeds: [new SuccessEmbed('¡Código recibido! Espera...')],
                    flags: [MessageFlags.Ephemeral]
                });

                try {
                    const token = modal.fields.getTextInputValue(SetupCollectorModal.inputId);
                    const viewer = await searchViewer(token);
    
                    await postgres.sql().begin(async transaction => {
                        (await transaction`
                            INSERT INTO 
                                member (
                                    discord_id,
                                    anilist_id,
                                    anilist_token                        
                                )
                                VALUES (
                                    ${this.interaction.user.id},
                                    ${viewer.id},
                                    ${token}
                                );
                        `);

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
                                    'ENABLED'
                                );
                        `);
                    });
    
                    await modal.editReply({
                        embeds: [new SuccessEmbed((`
                            Autentificación completada correctamente como [${viewer.name}](${viewer.siteUrl}). Utilizá \`/show-scores\` para decidir si mostrar tus puntuaciones en este servidor.
                        `).trim())]
                    });
                } catch (error) {
                    console.error(error);

                    await modal.editReply({
                        embeds: [new ErrorEmbed('¡Error al autenticarte! Revisa el código e inténtalo de nuevo.')]
                    });
                };

                collector.stop();
            };
        });
    };
};