import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Postgres from "../../../database/postgres";
import NoResultsException from "../../../errors/NoResultsException";
import { UserSchema } from "../../../database/types";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Helpers from "../../Helpers";
import Embed from "../../embeds/Embed";
import { MediaScore, SharedMedia } from "./types";
import AffinityCommandQueries from "./AffinityCommandQueries";
import IllegalArgumentException from "../../../errors/IllegalArgumentException";

export default class AffinityCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();
        const optionUser = this.interaction.options.getUser('user');

        if (optionUser.bot) {
            throw new IllegalArgumentException('No creo que puedas calcular tu afinidad con un bot!');
        }

        if (this.interaction.user.id === optionUser.id) {
            throw new IllegalArgumentException('No puedes calcular la afinidad contigo mismo. Es obvio que sera del **100%**, ¿no? ');
        }

        const queryInteractionUser = await this.findUser(this.interaction.user.id, this.interaction.guild.id);
        if (!queryInteractionUser) throw new NoResultsException('Antes de usar este comando debes autentificarte con </setup:1259062709647839301>.');

        const queryOptionUser = await this.findUser(optionUser.id, this.interaction.guild.id);
        if (!queryOptionUser) throw new NoResultsException(`${optionUser.username} no esta autentificado.`);

        const interactionUserMediaCollection = await this.findUserCompletedMedia(queryInteractionUser.id_anilist+'');
        const optionUserMediaCollection = await this.findUserCompletedMedia(queryOptionUser.id_anilist+'');

        const interactionUserStandardDeviation = interactionUserMediaCollection.data.coleccion.user.statistics.anime.standardDeviation.toFixed(1);
        const interactionUserMeanScore = interactionUserMediaCollection.data.coleccion.user.statistics.anime.meanScore.toFixed(1);
        const optionUserStandardDeviation = optionUserMediaCollection.data.coleccion.user.statistics.anime.standardDeviation.toFixed(1);
        const optionUserMeanScore = optionUserMediaCollection.data.coleccion.user.statistics.anime.meanScore.toFixed(1);

        const interactionUserCompletedAnimes = interactionUserMediaCollection.data.coleccion.lists[0].entries;
        const optionUserCompletedAnimes = optionUserMediaCollection.data.coleccion.lists[0].entries;

        const sharedMedia = this.findSharedMedia(interactionUserCompletedAnimes, optionUserCompletedAnimes);
        const sharedScore = this.findSharedScore(sharedMedia);

        const affinity = this.pearsonCorrelation(sharedMedia.map(media => media.scoreA), sharedMedia.map(media => media.scoreB)).toFixed(2);

        const EMBED_DESCRIPTION = 
            `**${this.interaction.user.username}** y **${optionUser.username}** tienen un **${affinity}%** de [afinidad](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient).\n\n`+

            `▸ Comparten **${sharedMedia.length}** animes.\n`+
            `▸ Comparten **${sharedScore}** notas.\n\n`+

            `**${this.interaction.user.username}**:\n`+
            `▸ Tiene un promedio de **${interactionUserMeanScore}**.\n`+
            `▸ Tiene una [desviación estándar](https://es.wikipedia.org/wiki/Desviaci%C3%B3n_t%C3%ADpica) del **${interactionUserStandardDeviation}**.\n\n`+

            `**${optionUser.username}**:\n`+
            `▸ Tiene un promedio de **${optionUserMeanScore}**.\n`+
            `▸ Tiene una [desviación estándar](https://es.wikipedia.org/wiki/Desviaci%C3%B3n_t%C3%ADpica) del **${optionUserStandardDeviation}**.`;

        const embed = new EmbedBuilder()
            .setColor(Embed.COLOR_ORANGE)
            .setDescription(EMBED_DESCRIPTION)

        await this.interaction.editReply({
            embeds: [embed]
        });
    }

    private async findUser (userId: string, serverId: string): Promise<UserSchema | null | undefined> {
        const queryUser: any =  await Postgres.query() `
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

    private async findUserCompletedMedia (anilistId: string) {
        const query = AffinityCommandQueries.CreateUserCompletedMediaQuery(anilistId);
        const results = await AnilistAPI.fetch(query);
        if (results.errors) {
            throw new Error(results.errors[0].message);
        }
        return results;
    }

    private findSharedMedia (u1_completedMedia: Array<MediaScore>, u2_completedMedia: Array<MediaScore>) {
        const sharedMedia = new Array<SharedMedia>();

        for (const u1_media of u1_completedMedia) {
            const u2_media = u2_completedMedia.find(media => media.mediaId == u1_media.mediaId);
            if (!u2_media) continue;
            sharedMedia.push({ id: u1_media.mediaId, scoreA: u1_media.score, scoreB: u2_media.score });
        }

        return sharedMedia;
    }

    private findSharedScore (sharedMedia: Array<SharedMedia>) {
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

    private pearsonCorrelation (arrX: number[], arrY: number[]): number {
        if (arrX.length !== arrY.length) {
            throw new Error('Los arrays deben tener la misma longitud.');
        }
    
        const meanX = Helpers.calculateAverage(arrX);
        const meanY = Helpers.calculateAverage(arrY);
        const stdDevX = this.standardDeviation(arrX, meanX);
        const stdDevY = this.standardDeviation(arrY, meanY);
        const covar = this.covariance(arrX, arrY, meanX, meanY);
    
        return covar / (stdDevX * stdDevY);
    } 

    /**
     * Función para calcular la desviación estándar de un array de números.
     * @param arr - Array de números.
     * @param mean - La media de los números en el array.
     * @returns La desviación estándar de los números en el array.
     */

    private standardDeviation (arr: number[], mean: number): number {
        const squareDiffs = arr.map(val => Math.pow(val - mean, 2));
        const avgSquareDiff = Helpers.calculateAverage(squareDiffs);
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

    private covariance (arrX: number[], arrY: number[], meanX: number, meanY: number): number {
        let covar = 0;

        for (let i = 0; i < arrX.length; i++) {
            covar += (arrX[i] - meanX) * (arrY[i] - meanY);
        }

        return covar;
    }
}