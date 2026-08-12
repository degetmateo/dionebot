import { ButtonInteraction, LabelBuilder, MessageFlags, ModalBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../../embeds/errorEmbed";

module.exports = {
    id: 'gacha-auction-push-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        character: WithId<Document>;
        base_price: number;
        characterUserId: string;
        users: Map<string, number>;
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        // if (data.characterUserId == interaction.user.id) {
        //     return await interaction.reply({
        //         flags: [MessageFlags.Ephemeral],
        //         embeds: [new ErrorEmbed('¡No puedes pujar por tu mismo personaje!')]
        //     });
        // };

        const form = new ModalBuilder();

        form
            .setTitle(`¡Puja por ${data.character.name}!`)
            .setCustomId(`gacha-auction-push-modal_${data.key}`)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `Estás a punto de pujar por este personaje. ` +
                        `Recuerda que una vez envíes este formulario, el anfitrión de la subasta podrá aceptar tu puja.\n\n`+
                        `Tu monto no debe ser inferior a \`$${data.base_price}\`.\n\n`+
                        `Ten en cuenta que si ya has hecho una puja, una nueva reemplazará a la anterior.`
                    )
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel('Ingresa cuánto vas a pujar.')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setPlaceholder('¡Escribe tu monto!')
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setCustomId('gacha-auction-push-modal-input')
                    )
            )
        ;

        await interaction.showModal(form);
    }
};