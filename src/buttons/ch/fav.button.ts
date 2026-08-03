import { ButtonInteraction, MessageFlags } from "discord.js";
import ErrorEmbed from "../../embeds/errorEmbed";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";

module.exports = {
    id: 'fav-button',
    execute: async (interaction: ButtonInteraction, character: {
        _id: number;
        key: string;
        name: string;
    }) => {
        if (!character) {
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        const _id = `${interaction.guild?.id}_${character._id}_${interaction.user.id}` as any;
        const fav = await mongo.favourites.findOne({ _id });

        if (fav) {
            mongo.favourites.deleteOne({ _id });
            
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed(`¡Ya no quieres a **${character.name}**!`)]
            });
        } else {
            mongo.favourites.insertOne({
                _id,
                user_id: interaction.user.id,
                guild_id: interaction.guild?.id,
                character_id: character._id
            });

            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new SuccessEmbed(`¡Has indicado que quieres a **${character.name}**!`)]
            });
        };
    }
};