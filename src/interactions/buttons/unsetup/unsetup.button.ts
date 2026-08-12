import { ButtonInteraction, MessageFlags } from "discord.js";
import mongo from "../../../database/mongo";
import SuccessEmbed from "../../../embeds/successEmbed";

module.exports = {
    id: 'unsetup-button',
    execute: async (interaction: ButtonInteraction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        await mongo.users.deleteOne({ _id: interaction.user.id as any });
        await mongo.memberships.deleteOne({ _id: `${interaction.guild?.id}_${interaction.user.id}` as any });

        await interaction.editReply({
            embeds: [new SuccessEmbed('Eliminé todos los datos de tu perfil correctamente.')]
        });
    }
};