import { ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import searchMangaByName from "./searchMangaByName";
import searchMangaById from "./searchMangaById";
import MangaEmbed from "../../embeds/mangaEmbed";

export default class MangaCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        await this.interaction.deferReply();

        const args = this.interaction.options.getString('name-or-id') as string;
        
        Helpers.isNumber(args) ?
            await this.searchById(args) :
            await this.searchByName(args);
    };

    async searchById (id: any) {
        AnimeValidator.validateId(id);

        const data = await searchMangaById(id);

        await this.interaction.editReply({
            embeds: [new MangaEmbed(data)]
        });
    };

    async searchByName (name: string) {
        AnimeValidator.validateName(name);

        const data = await searchMangaByName(name);

        await this.interaction.editReply({
            embeds: [new MangaEmbed(data)]
        });
    };
};