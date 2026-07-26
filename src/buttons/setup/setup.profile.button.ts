import { ButtonInteraction, LabelBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import ErrorEmbed from "../../embeds/errorEmbed";

module.exports = {
    id: 'setup-profile-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        profile: null | any;
    }) => {
        if (!data) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            })
        };

        const modal = new ModalBuilder()
            .setCustomId(`setup-profile-modal_${data.key}`)
            .setTitle('¡Customiza tu perfil!')
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel('Modifica el color de tu perfil.')
                    .setDescription('El color que ingreses debe estar en formato hexadecimal.')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId('setup-profile-modal-input-color')
                            .setPlaceholder('Tu código hexadecimal...')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setValue(data.profile ? data.profile.color || '' : '')
                    ),
                new LabelBuilder()
                    .setLabel('Plataforma preferida para mostrar datos.')
                    .setDescription('Será la plataforma por defecto con la cual se mostrarán datos en tu perfil de usuario.')
                    .setStringSelectMenuComponent(
                        new StringSelectMenuBuilder()
                            .setCustomId('setup-profile-modal-select-preferred-platform')
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setDefault(data.profile ? !data.profile.preferred_platform : false)
                                    .setLabel('Sin especificar')
                                    .setValue('NONE'),
                                new StringSelectMenuOptionBuilder()
                                    .setDefault(data.profile ? data.profile.preferred_platform === 'ANILIST' : false)
                                    .setLabel('ANILIST')
                                    .setValue('ANILIST'),
                                new StringSelectMenuOptionBuilder()
                                    .setDefault(data.profile ? data.profile.preferred_platform === 'MAL' : false)
                                    .setLabel('MyAnimeList')
                                    .setValue('MAL'),
                                new StringSelectMenuOptionBuilder()
                                    .setDefault(data.profile ? data.profile.preferred_platform === 'VNDB' : false)
                                    .setLabel('Visual Novel Database')
                                    .setValue('VNDB')
                            )
                    ),
                new LabelBuilder()
                    .setLabel('Avatar de perfil.')
                    .setDescription('URL de una imagen que usaremos como tu avatar de perfil.')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId('setup-profile-modal-input-avatar-url')
                            .setRequired(false)
                            .setPlaceholder('Enlace de tu avatar...')
                            .setStyle(TextInputStyle.Short)
                            .setValue(data.profile ? data.profile.avatar_url || '' : '')
                    ),
                new LabelBuilder()
                    .setLabel('Banner de perfil.')
                    .setDescription('URL de una imagen que usaremos como tu banner de perfil.')
                    .setTextInputComponent(
                        new TextInputBuilder()
                            .setCustomId('setup-profile-modal-input-banner-url')
                            .setRequired(false)
                            .setPlaceholder('Enlace de tu banner...')
                            .setStyle(TextInputStyle.Short)
                            .setValue(data.profile ? data.profile.banner_url || '' : '')
                    ),
            )

        await interaction.showModal(modal);
    }
};