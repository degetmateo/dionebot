import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import EmbedAnime from "../../embeds/EmbedAnime";
import Postgres from "../../../database/postgres";

export default class RandomCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const userId = this.interaction.user.id;
        const serverId = this.interaction.guild.id;

        const queryMembership =  await Postgres.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;

        if (!queryMembership[0]) throw new NoResultsException('No estas registrado.');

        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId};
        `;

        const plannedAnimes = await AnilistAPI.fetchUserPlannedAnimes(queryUser[0].id_anilist);
        const randomAnime = Helpers.getRandomElement(plannedAnimes.lists[0].entries);

        if (!randomAnime) throw new NoResultsException('No se han encontrado animes planeados.');

        const anime = await AnilistAPI.fetchAnimeById(randomAnime.mediaId);
        const embed = EmbedAnime.Create(anime);

        try {
            await this.interaction.reply( {embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }
}