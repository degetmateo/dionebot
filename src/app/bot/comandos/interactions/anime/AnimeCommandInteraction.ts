import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder } from "discord.js";

import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import Anime from "../../../apis/anilist/modelos/media/Anime";
import EmbedAnime from "../../../embeds/EmbedAnime";
import Button from "../../components/Button";
import Helpers from "../../../Helpers";
import IllegalArgumentException from "../../../../errores/IllegalArgumentException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import EmbedScores from "../../../embeds/EmbedScores";
import CommandUnderMaintenanceException from "../../../../errores/CommandUnderMaintenanceException";

export default class AnimeCommandInteraction extends CommandInteraction {
    protected readonly interaction: ChatInputCommandInteraction<CacheType>;

    private readonly bot: Bot;
    private readonly serverId: string;
    private readonly query: string;
    private readonly queryIsNumber: boolean;
    private readonly translate: boolean;
    
    private page: number;
    private lastPage: number;

    private animes: Array<Anime>;
    private embeds: Array<EmbedAnime>;

    private readonly buttonPreviousPage = Button.CreatePrevious();
    private readonly buttonNextPage = Button.CreateNext();
    private readonly row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.buttonPreviousPage, this.buttonNextPage);

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        
        this.bot = interaction.client as Bot;
        this.serverId = interaction.guildId;
        this.query = interaction.options.getString('nombre-o-id');
        this.queryIsNumber = Helpers.isNumber(this.query);
        this.translate = interaction.options.getBoolean('traducir') || false;

        this.page = 0;
        this.lastPage = 0;

        this.animes = new Array<Anime>();
        this.embeds = new Array<EmbedAnime>();
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
        throw new CommandUnderMaintenanceException('Comando en mantenimiento.');
    }
}