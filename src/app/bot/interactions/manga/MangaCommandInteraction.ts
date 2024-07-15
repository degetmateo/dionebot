import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import MangaInteractionController from "./MangaInteractionController";
import IllegalArgumentException from "../../../errors/IllegalArgumentException";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";

export default class MangaCommandInteraction extends CommandInteraction {
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
            await this.findMangaById() :
            await this.findMangaByName();
    }

    private async findMangaById (): Promise<void> {
        const mangaId = parseInt(this.query);

        if (mangaId < 0 || mangaId > CommandInteraction.NUMERO_MAXIMO_32_BITS) {
            throw new IllegalArgumentException('La ID que has ingresado no es válida.');
        }

        const manga = await AnilistAPI.fetchMangaById(mangaId);
        const controller = new MangaInteractionController(this.interaction, [manga]);
        await controller.execute();
    }

    private async findMangaByName (): Promise<void> {
        const mangas = await AnilistAPI.fetchMangaByName(this.query);
        const controller = new MangaInteractionController(this.interaction, mangas);
        await controller.execute();
    }
}