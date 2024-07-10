import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Postgres from "../../../database/postgres";
import NoResultsException from "../../../errors/NoResultsException";
import { UserSchema } from "../../../database/types";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import GenericException from "../../../errors/GenericException";
import { MediaScore, SharedMedia } from "../afinidad/types/affinity";
import Helpers from "../../Helpers";
import Embed from "../../embeds/Embed";

export default class AffinityCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();
        const optionUser = this.interaction.options.getUser('user');

        const queryInteractionUser = await this.findUser(this.interaction.user.id, this.interaction.guild.id);
        if (!queryInteractionUser) throw new NoResultsException('Antes de usar este comando debes autentificarte con </setup:1259062709647839301>.');

        const queryOptionUser = await this.findUser(optionUser.id, this.interaction.guild.id);
        if (!queryOptionUser) throw new NoResultsException(`${optionUser.username} no esta autentificado.`);

        const interactionUserMediaCollection = await this.findUserCompletedMedia(queryInteractionUser.id_anilist+'');
        const optionUserMediaCollection = await this.findUserCompletedMedia(queryOptionUser.id_anilist+'');

        if (interactionUserMediaCollection.errors || optionUserMediaCollection.errors) {
            throw new GenericException('Ha ocurrido un error. Intentalo de nuevo mas tarde.');
        }

        const interactionUserCompletedAnimes = interactionUserMediaCollection.data.coleccion.lists[0].entries;
        const optionUserCompletedAnimes = optionUserMediaCollection.data.coleccion.lists[0].entries;

        const sharedMedia = this.findSharedMedia(interactionUserCompletedAnimes, optionUserCompletedAnimes);
        const affinity = this.calculateAffinity(sharedMedia).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor(Embed.COLOR_ORANGE)
            .setDescription(`La afinidad entre **${this.interaction.user.username}** y **${optionUser.username}** es de **${affinity}%**.`)

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

        return await AnilistAPI.fetch(query);
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

    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * 
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */

    private calculateAffinity (sharedMedia: Array<SharedMedia>): number {
        const scoresA: Array<number> = sharedMedia.map(media => media.scoreA);
        const scoresB: Array<number> = sharedMedia.map(media => media.scoreB);

        const ma = Helpers.calculateAverage(scoresA);
        const mb = Helpers.calculateAverage(scoresB);

        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);

        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));

        const numerator = Helpers.addElements(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominator = Math.sqrt(Helpers.addElements(sa) * Helpers.addElements(sb));

        return (numerator <= 0 || denominator <= 0 ? 0 : numerator / denominator) * 100;
    }

    private zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);
}