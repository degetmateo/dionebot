import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Manga from "../../apis/anilist/modelos/media/Manga";
import EmbedManga from "../../embeds/EmbedManga";
import EmbedScores from "../../embeds/EmbedScores";
import InteractionController from "../InteractionController";
import Postgres from "../../../database/postgres";

export default class MangaInteractionController extends InteractionController {
    protected media: Array<Manga>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, mangas: Array<Manga>) {
        super(interaction, mangas);
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guildId;
        const translate = this.interaction.options.getBoolean('traducir') || false;

        const queryUsers =  await Postgres.query() `
            SELECT * FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${serverId} and
                mem.id_user = du.id_user;
        `;

        this.embeds = translate ?
            await Helpers.asyncMap(this.media, async manga => await EmbedManga.CreateTranslated(manga)) :
            this.media.map(manga => EmbedManga.Create(manga));

        const manga = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(manga.getId() + '', queryUsers.map(u => u.id_anilist+'')));

        const embedManga = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(manga.getColor());

        const embeds = (!scores.isEmpty()) ?
            [embedManga, embedScores] : [embedManga];


        if (this.media.length === 1) {
            await this.interaction.reply({
                embeds: embeds
            })

            return;
        }

        try {
            const res = await this.interaction.reply({
                embeds: embeds,
                components: [this.row],
                fetchReply: true
            })

            await this.createCollector(res);
        } catch (error) {
            throw error;   
        }
    }
}