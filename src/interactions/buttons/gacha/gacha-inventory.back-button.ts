import { ButtonInteraction, MessageFlags } from "discord.js";
import GachaInventoryComponent from "../../../components/gacha-inventory.component";
import ErrorEmbed from "../../../embeds/errorEmbed";
module.exports = {
    id: 'gacha-inventory-back-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        index: number;
        cards: GachaInventoryComponent[];
    }) => {
        if (!data) {
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        data.index = data.index - 1;
        if (data.index < 0) data.index = data.cards.length - 1;

        await interaction.update({
            flags: [MessageFlags.IsComponentsV2],
            components: [data.cards[data.index]]
        });
    }
};