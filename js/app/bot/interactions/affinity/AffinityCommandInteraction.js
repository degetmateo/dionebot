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
const Helpers_1 = __importDefault(require("../../Helpers"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
const AffinityCommandQueries_1 = __importDefault(require("./AffinityCommandQueries"));
const IllegalArgumentException_1 = __importDefault(require("../../../errors/IllegalArgumentException"));
class AffinityCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const optionUser = this.interaction.options.getUser('user');
        if (optionUser.bot) {
            throw new IllegalArgumentException_1.default('No creo que puedas calcular tu afinidad con un bot!');
        }
        if (this.interaction.user.id === optionUser.id) {
            throw new IllegalArgumentException_1.default('No puedes calcular la afinidad contigo mismo. Es obvio que sera del **100%**, ¿no? ');
        }
        const queryInteractionUser = await this.findUser(this.interaction.user.id, this.interaction.guild.id);
        if (!queryInteractionUser)
            throw new NoResultsException_1.default('Antes de usar este comando debes autentificarte con </setup:1259062709647839301>.');
        const queryOptionUser = await this.findUser(optionUser.id, this.interaction.guild.id);
        if (!queryOptionUser)
            throw new NoResultsException_1.default(`${optionUser.username} no esta autentificado.`);
        const interactionUserMediaCollection = await this.findUserCompletedMedia(queryInteractionUser.id_anilist + '');
        const optionUserMediaCollection = await this.findUserCompletedMedia(queryOptionUser.id_anilist + '');
        const interactionUserStandardDeviation = interactionUserMediaCollection.data.coleccion.user.statistics.anime.standardDeviation.toFixed(1);
        const interactionUserMeanScore = interactionUserMediaCollection.data.coleccion.user.statistics.anime.meanScore.toFixed(1);
        const optionUserStandardDeviation = optionUserMediaCollection.data.coleccion.user.statistics.anime.standardDeviation.toFixed(1);
        const optionUserMeanScore = optionUserMediaCollection.data.coleccion.user.statistics.anime.meanScore.toFixed(1);
        const interactionUserCompletedAnimes = interactionUserMediaCollection.data.coleccion.lists[0].entries;
        const optionUserCompletedAnimes = optionUserMediaCollection.data.coleccion.lists[0].entries;
        const sharedMedia = this.findSharedMedia(interactionUserCompletedAnimes, optionUserCompletedAnimes);
        const sharedScore = this.findSharedScore(sharedMedia);
        const pearson = this.pearsonCorrelation(sharedMedia.map(media => media.scoreA), sharedMedia.map(media => media.scoreB));
        let affinity = isNaN(pearson) ? 0 : pearson.toFixed(2);
        const EMBED_DESCRIPTION = `**${this.interaction.user.username}** y **${optionUser.username}** tienen un **${affinity}%** de [afinidad](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient).\n\n` +
            `▸ Comparten **${sharedMedia.length}** animes.\n` +
            `▸ Comparten **${sharedScore}** notas.\n\n` +
            `**${this.interaction.user.username}**:\n` +
            `▸ Tiene un promedio de **${interactionUserMeanScore}**.\n` +
            `▸ Tiene una [desviación estándar](https://es.wikipedia.org/wiki/Desviaci%C3%B3n_t%C3%ADpica) del **${interactionUserStandardDeviation}**.\n\n` +
            `**${optionUser.username}**:\n` +
            `▸ Tiene un promedio de **${optionUserMeanScore}**.\n` +
            `▸ Tiene una [desviación estándar](https://es.wikipedia.org/wiki/Desviaci%C3%B3n_t%C3%ADpica) del **${optionUserStandardDeviation}**.`;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Embed_1.default.COLOR_ORANGE)
            .setDescription(EMBED_DESCRIPTION);
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
        const query = AffinityCommandQueries_1.default.CreateUserCompletedMediaQuery(anilistId);
        const results = await AnilistAPI_1.default.fetch(query);
        if (results.errors) {
            throw new Error(results.errors[0].message);
        }
        return results;
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
    findSharedScore(sharedMedia) {
        return sharedMedia.filter(media => media.scoreA === media.scoreB).length;
    }
    /**
     * Método que calcula el coeficiente de correlación de Pearson entre dos usuarios.
     *
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * @param arrX - Primer array de números
     * @param arrY - Segundo array de números
     * @returns El coeficiente de correlación de Pearson entre los dos arrays
     */
    pearsonCorrelation(arrX, arrY) {
        if (arrX.length !== arrY.length) {
            throw new Error('Los arrays deben tener la misma longitud.');
        }
        const meanX = Helpers_1.default.calculateAverage(arrX);
        const meanY = Helpers_1.default.calculateAverage(arrY);
        const stdDevX = this.standardDeviation(arrX, meanX);
        const stdDevY = this.standardDeviation(arrY, meanY);
        const covar = this.covariance(arrX, arrY, meanX, meanY);
        const result = covar / (stdDevX * stdDevY);
        return result <= 0 ? 0 : result;
    }
    /**
     * Función para calcular la desviación estándar de un array de números.
     * @param arr - Array de números.
     * @param mean - La media de los números en el array.
     * @returns La desviación estándar de los números en el array.
     */
    standardDeviation(arr, mean) {
        const squareDiffs = arr.map(val => Math.pow(val - mean, 2));
        const avgSquareDiff = Helpers_1.default.calculateAverage(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }
    /**
     * Función para calcular la covarianza entre dos arrays de números.
     * @param arrX - Primer array de números.
     * @param arrY - Segundo array de números.
     * @param meanX - La media del primer array.
     * @param meanY - La media del segundo array.
     * @returns La covarianza entre los dos arrays.
     */
    covariance(arrX, arrY, meanX, meanY) {
        let covar = 0;
        for (let i = 0; i < arrX.length; i++) {
            covar += (arrX[i] - meanX) * (arrY[i] - meanY);
        }
        return covar;
    }
}
exports.default = AffinityCommandInteraction;
