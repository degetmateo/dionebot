import { CacheType, ChatInputCommandInteraction } from "discord.js";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Anime from "../../apis/anilist/modelos/media/Anime";
import EmbedAnime from "../../embeds/EmbedAnime";
import EmbedScores from "../../embeds/EmbedScores";
import InteractionController from "../InteractionController";
import Postgres from "../../../database/postgres";

export default class AnimeInteractionController extends InteractionController {
    protected media: Array<Anime>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, animes: Array<Anime>) {
        super(interaction, animes);
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guild.id;

        const queryUsers =  await Postgres.query() `
            SELECT * FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${serverId} and
                mem.id_user = du.id_user;
        `;

        this.embeds = this.media.map(media => EmbedAnime.Create(media));

        const anime = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(anime.getId() + '', queryUsers.map(u => u.id_anilist+'')));

        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(anime.getColor());

        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];


        if (this.media.length === 1) {
            await this.interaction.editReply({
                embeds: embeds
            })

            return;
        }

        try {
            const res = await this.interaction.editReply({
                embeds: embeds,
                components: [this.row]
            })
    
            await this.createCollector(res);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}