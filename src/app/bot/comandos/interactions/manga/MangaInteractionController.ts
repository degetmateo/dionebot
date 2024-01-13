import { CacheType, ChatInputCommandInteraction } from "discord.js";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import EmbedScores from "../../../embeds/EmbedScores";
import InteractionController from "../InteractionController";
import Manga from "../../../apis/anilist/modelos/media/Manga";
import EmbedManga from "../../../embeds/EmbedManga";
import Helpers from "../../../Helpers";

export default class MangaInteractionController extends InteractionController {
    protected media: Array<Manga>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, mangas: Array<Manga>) {
        super(interaction, mangas);
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guildId;
        const users = this.bot.servers.getUsers(serverId);
        const translate = this.interaction.options.getBoolean('traducir') || false;

        this.embeds = translate ?
            await Helpers.asyncMap(this.media, async manga => await EmbedManga.CreateTranslated(manga)) :
            this.media.map(manga => EmbedManga.Create(manga));

        const manga = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(manga.obtenerID() + '', users.map(u => u.anilistId)));

        const embedManga = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(manga.obtenerColor());

        const embeds = (!scores.isEmpty()) ?
            [embedManga, embedScores] : [embedManga];


        if (this.media.length === 1) {
            await this.interaction.editReply({
                embeds: embeds
            })

            return;
        }

        const res = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        })

        await this.createCollector(res);
    }
}