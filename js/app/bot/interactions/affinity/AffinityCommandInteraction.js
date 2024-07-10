"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const GenericException_1 = __importDefault(require("../../../errors/GenericException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
class AffinityCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.zip = (a, b) => a.map((k, i) => [k, b[i]]);
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const optionUser = this.interaction.options.getUser('user');
        const queryInteractionUser = await this.findUser(this.interaction.user.id, this.interaction.guild.id);
        if (!queryInteractionUser)
            throw new NoResultsException_1.default('Antes de usar este comando debes autentificarte con </setup:1259062709647839301>.');
        const queryOptionUser = await this.findUser(optionUser.id, this.interaction.guild.id);
        if (!queryOptionUser)
            throw new NoResultsException_1.default(`${optionUser.username} no esta autentificado.`);
        const interactionUserMediaCollection = await this.findUserCompletedMedia(queryInteractionUser.id_anilist + '');
        const optionUserMediaCollection = await this.findUserCompletedMedia(queryOptionUser.id_anilist + '');
        if (interactionUserMediaCollection.errors || optionUserMediaCollection.errors) {
            throw new GenericException_1.default('Ha ocurrido un error. Intentalo de nuevo mas tarde.');
        }
        const interactionUserCompletedAnimes = interactionUserMediaCollection.data.coleccion.lists[0].entries;
        const optionUserCompletedAnimes = optionUserMediaCollection.data.coleccion.lists[0].entries;
        const sharedMedia = this.findSharedMedia(interactionUserCompletedAnimes, optionUserCompletedAnimes);
        const affinity = this.calculateAffinity(sharedMedia).toFixed(2);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Embed_1.default.COLOR_ORANGE)
            .setDescription(`La afinidad entre **${this.interaction.user.username}** y **${optionUser.username}** es de **${affinity}%**.`);
        await this.interaction.editReply({
            embeds: [embed]
        });
    }
    async findUser(userId, serverId) {
        const queryUser = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user 
            IN (
                SELECT id_user FROM
                    membership
                WHERE
                    id_user = ${userId} and
                    id_server = ${serverId}
            );
        `;
        return queryUser[0];
    }
    async findUserCompletedMedia(anilistId) {
        const query = `
            query {
                coleccion: MediaListCollection (userId: ${anilistId}, type: ANIME, status: COMPLETED) {
                    user {
                        id
                    }
                    lists {
                        entries {
                            mediaId
                            score(format: POINT_100)
                        }
                    }
                }
            }
        `;
        return await AnilistAPI_1.default.fetch(query);
    }
    findSharedMedia(u1_completedMedia, u2_completedMedia) {
        const sharedMedia = new Array();
        for (const u1_media of u1_completedMedia) {
            const u2_media = u2_completedMedia.find(media => media.mediaId == u1_media.mediaId);
            if (!u2_media)
                continue;
            sharedMedia.push({ id: u1_media.mediaId, scoreA: u1_media.score, scoreB: u2_media.score });
        }
        return sharedMedia;
    }
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     *
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    calculateAffinity(sharedMedia) {
        const scoresA = sharedMedia.map(media => media.scoreA);
        const scoresB = sharedMedia.map(media => media.scoreB);
        const ma = Helpers_1.default.calculateAverage(scoresA);
        const mb = Helpers_1.default.calculateAverage(scoresB);
        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);
        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));
        const numerator = Helpers_1.default.addElements(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominator = Math.sqrt(Helpers_1.default.addElements(sa) * Helpers_1.default.addElements(sb));
        return (numerator <= 0 || denominator <= 0 ? 0 : numerator / denominator) * 100;
    }
}
exports.default = AffinityCommandInteraction;
