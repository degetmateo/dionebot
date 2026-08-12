import { ColorResolvable, ModalSubmitInteraction } from "discord.js";
import { Document, Filter, MatchKeysAndValues, UpdateFilter } from "mongodb";
import mongo from "../../database/mongo";
import ErrorEmbed from "../../embeds/errorEmbed";
import SuccessEmbed from "../../embeds/successEmbed";

module.exports = {
    id: 'setup-profile-modal',
    execute: async (interaction: ModalSubmitInteraction) => {
        const colorValue = interaction.fields.getTextInputValue('setup-profile-modal-input-color').trim();
        const color = colorValue as ColorResolvable;

        const avatarURL = interaction.fields.getTextInputValue('setup-profile-modal-input-avatar-url').trim();
        const bannerURL = interaction.fields.getTextInputValue('setup-profile-modal-input-banner-url').trim();

        const filter: Filter<Document> = { _id: interaction.user.id as any };
        const set: MatchKeysAndValues<Document> = {};

        if (colorValue && colorValue.length > 0) {
            set['profile.color'] = color;   
        } else {
            set['profile.color'] = null;
        };

        if (avatarURL && avatarURL.length > 0) {
            set['profile.avatar_url'] = avatarURL;
        } else {
            set['profile.avatar_url'] = null;
        };

        if (bannerURL && bannerURL.length > 0) {
            set['profile.banner_url'] = bannerURL;
        } else {
            set['profile.banner_url'] = null;
        };

        const update: UpdateFilter<Document> = { $set: set };

        const user = await mongo.users.findOneAndUpdate(filter, update, { upsert: false });

        if (!user) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('No estás registrado. Utiliza \`/setup\` para registrarte.')]
            });
        };

        await interaction.reply({
            flags: 'Ephemeral',
            embeds: [new SuccessEmbed('Has customizado tu perfil correctamente. Puedes verlo usando el comando \`/user\`.')]
        });
    }
}