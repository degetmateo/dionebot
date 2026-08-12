import { ButtonInteraction, MessageFlags } from "discord.js";
import CharacterInfoCardComponent from "../../components/character-info-card.component";
import ErrorEmbed from "../../embeds/errorEmbed";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";

module.exports = {
    id: 'character-fav-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        index: number;
        cards: CharacterInfoCardComponent[];
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        const _id = `${interaction.guild?.id}_${data.cards[data.index].character_data.id}_${interaction.user.id}` as any;
        const fav = await mongo.favourites.findOne({ _id });

        if (fav) {
            mongo.favourites.deleteOne({ _id });
            
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed(`¡Ya no quieres a **${data.cards[data.index].character_data.name}**!`)]
            });
        } else {
            mongo.favourites.insertOne({
                _id,
                user_id: interaction.user.id,
                guild_id: interaction.guild?.id,
                character_id: data.cards[data.index].character_data.id
            });

            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new SuccessEmbed(`¡Has indicado que quieres a **${data.cards[data.index].character_data.name}**!`)]
            });
        };
    }
};