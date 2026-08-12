import { ButtonInteraction, MessageFlags } from "discord.js";
import CharacterInfoCardComponent from "../../../components/character-info-card.component";
import ErrorEmbed from "../../../embeds/errorEmbed";

module.exports = {
    id: 'character-next-button',
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

        data.index = data.index + 1;
        if (data.index > data.cards.length - 1) data.index = 0;

        await interaction.update({
            flags: [MessageFlags.IsComponentsV2],
            components: [data.cards[data.index]]
        });
    }
};