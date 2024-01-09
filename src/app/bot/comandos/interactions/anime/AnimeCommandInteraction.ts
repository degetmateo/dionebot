import { ChatInputCommandInteraction, CacheType } from "discord.js";

import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import EmbedAnime from "../../../embeds/EmbedAnime";
import Helpers from "../../../Helpers";
import IllegalArgumentException from "../../../../errores/IllegalArgumentException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import EmbedScores from "../../../embeds/EmbedScores";
import InteractionController from "./InteractionController";

export default class AnimeCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private readonly bot: Bot;
    private readonly serverId: string;
    private readonly query: string;
    private readonly queryIsNumber: boolean;
    private readonly translate: boolean;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        
        this.bot = interaction.client as Bot;
        this.serverId = interaction.guildId;
        this.query = interaction.options.getString('nombre-o-id');
        this.queryIsNumber = Helpers.isNumber(this.query);
        this.translate = interaction.options.getBoolean('traducir') || false;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        this.queryIsNumber ? 
            await this.findAnimeById() :
            await this.findAnimeByName();
    }

    private async findAnimeById (): Promise<void> {
        const animeId = parseInt(this.query);

        if (animeId < 0 || animeId > CommandInteraction.NUMERO_MAXIMO_32_BITS) {
            throw new IllegalArgumentException('La ID que has ingresado no es válida.');
        }

        const anime = await AnilistAPI.fetchAnimeById(animeId);
        const embedAnime = this.translate ? await EmbedAnime.CreateTranslated(anime) : EmbedAnime.Create(anime);
        
        const users = this.bot.servers.getUsers(this.serverId);

        const scores = await AnilistAPI.fetchUsersScores(this.query, users.map(user => user.anilistId));
        const embedScores = EmbedScores.Create(scores).setColor(anime.obtenerColor());

        try {
            scores.isEmpty() ?
                await this.interaction.editReply( {embeds: [embedAnime] }) :
                await this.interaction.editReply({ embeds: [embedAnime, embedScores] });
        } catch (error) {
            await this.interaction.editReply({ embeds: [embedAnime] });
            console.error(error);
        }
    }

    private async findAnimeByName (): Promise<void> {
        const animes = await AnilistAPI.fetchAnimeByName(this.query);
        const embeds = animes.map(a => EmbedAnime.Create(a));
        const controller = new InteractionController(this.interaction, animes, embeds);
        await controller.execute();
    }
}