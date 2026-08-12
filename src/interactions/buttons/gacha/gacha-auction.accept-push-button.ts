import { ButtonInteraction, MessageFlags, TextDisplayBuilder } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../../embeds/errorEmbed";
import GenericError from "../../../errors/genericError";

module.exports = {
    id: 'gacha-auction-accept-push-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        character: WithId<Document>;
        base_price: number;
        characterUserId: string;
        users: Map<string, number>;
    }) => {
        if (!data) return;

        if (interaction.user.id != data.characterUserId) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('¡No eres el anfitrión de esta subasta!')]
            });
        };

        const pushUserId = interaction.customId.split('_')[2];
        const push = data.users.get(pushUserId);

        if (!push) throw new GenericError('Ha ocurrido un error.');

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder()
                    .setContent(`Has aceptado la puja de <@${pushUserId}> por \`$${push}\` renas.`)
            ]
        });
    }
};