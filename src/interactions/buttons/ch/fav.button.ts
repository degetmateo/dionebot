import { ButtonInteraction, MessageFlags, TextDisplayBuilder } from "discord.js";
import mongo from "../../../database/mongo";
import { memoryModule } from "../../../modules/mem.module";

module.exports = {
    id: 'fav-button',
    execute: async (interaction: ButtonInteraction) => {
        const interactionId = interaction.customId;
        const characterId = interactionId.split('_')[2];
        const character = memoryModule.characters.find(char => Number(char._id) === Number(characterId));

        const _id = `${interaction.guild?.id}_${characterId}_${interaction.user.id}` as any;
        const fav = await mongo.favourites.findOne({ _id });

        if (fav) {
            mongo.favourites.deleteOne({ _id });
            
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder()
                        .setContent(`Has indicado que **no** quieres a \`${character.name}\`.`)
                ]
            });
        } else {
            mongo.favourites.insertOne({
                _id,
                user_id: interaction.user.id,
                guild_id: interaction.guild?.id,
                character_id: character._id
            });

            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder()
                        .setContent(`Has indicado que quieres a \`${character.name}\`.`)
                ]
            });
        };
    }
};