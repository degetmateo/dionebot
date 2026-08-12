import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { Document, Filter } from "mongodb";
import Bot from "../../extensions/bot.extension";
import ErrorEmbed from "../../embeds/errorEmbed";
import anilist from "../../apis/anilist/anilist";
import mongo from "../../database/mongo";
import SetupSuccessEmbed from "../../builders/embeds/setupSuccess.embed";

module.exports = {
    id: 'setup-instructions-anilist-modal',
    execute: async (interaction: ModalSubmitInteraction) => {
        const bot = interaction.client as Bot;
        const values = interaction.customId.split('_');
        const key = values[1];
        const member = bot.get(key);

        if (!member) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        if (interaction.user.id != member._id) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('No tienes permiso para realizar esta acción.')]
            });
        };

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const token = interaction.fields.getTextInputValue('setup-instructions-anilist-input');
        const viewer = await anilist.viewer(token);

        const filter: Filter<Document> = { _id: member._id };

        const query = await mongo.users.findOneAndUpdate(
            filter,
            { 
                $set: {
                    preferred_platform: 'anilist', 
                    anilist: { 
                        id: viewer.id, 
                        token: token 
                    } 
                } 
            },
            { upsert: false }
        );
    
        if (!query) {
            return await interaction.editReply({
                embeds: [new ErrorEmbed('No hemos encontrado tu perfil.')]
            });
        };
    
        member.caches.forEach((c: string) => bot.delete(c));

        await interaction.editReply({
            embeds: [new SetupSuccessEmbed(viewer.name, viewer.siteUrl)]
        });
    }
};