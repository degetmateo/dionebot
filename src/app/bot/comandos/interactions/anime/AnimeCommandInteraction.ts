import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import Helpers from "../../../Helpers";
import IllegalArgumentException from "../../../../errors/IllegalArgumentException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import AnimeInteractionController from "./AnimeInteractionController";

export default class AnimeCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private readonly query: string;
    private readonly queryIsNumber: boolean;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        
        this.query = interaction.options.getString('nombre-o-id');
        this.queryIsNumber = Helpers.isNumber(this.query);
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
        const controller = new AnimeInteractionController(this.interaction, [anime]);
        await controller.execute();
    }

    private async findAnimeByName (): Promise<void> {
        const animes = await AnilistAPI.fetchAnimeByName(this.query);
        const controller = new AnimeInteractionController(this.interaction, animes);
        await controller.execute();
    }
}