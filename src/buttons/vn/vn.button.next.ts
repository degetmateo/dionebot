import { ButtonInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../embeds/errorEmbed";
import vndb from "../../apis/vndb/vndb";
import VNScoresEmbed from "../../builders/embeds/vn.scores.embed";

module.exports = {
    id: 'vn-button-next',
    execute: async (interaction: ButtonInteraction, data: {
        users: WithId<Document>[];
        media: any[];
        index: number;
        vnsEmbeds: EmbedBuilder[];
        scoresEmbeds: EmbedBuilder[];
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        data.index = data.index + 1;
        if (data.index > data.vnsEmbeds.length - 1) data.index = 0;
    
        if (!data.scoresEmbeds[data.index]) {
            const scores = await vndb.scores(data.users.map(user => {
                return {
                    userId: user.vndb.id,
                    username: user.vndb.username,
                    userToken: user.vndb.auth.token,
                    vnId: data.media[data.index].id
                }
            }));

            data.scoresEmbeds[data.index] = scores.length > 0 ?
                new VNScoresEmbed(scores):
                new ErrorEmbed('No hay votos para esta novela visual.');
        };

        await interaction.update({
            embeds: [data.vnsEmbeds[data.index], data.scoresEmbeds[data.index]]
        });
    }
};