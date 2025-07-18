import { ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import searchMangaByName from "./searchMangaByName";
import searchMangaById from "./searchMangaById";
import MangaEmbed from "../../embeds/mangaEmbed";
import SuccessEmbed from "../../embeds/successEmbed";

export default class MangaCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        await this.interaction.reply({
            embeds: [new SuccessEmbed('Buscando...')]
        });

        const args = this.interaction.options.getString('name-or-id') as string;
        
        Helpers.isNumber(args) ?
            await this.searchById(args) :
            await this.searchByName(args);

        await this.interaction.editReply({
            embeds: [new SuccessEmbed('¡Resultados listos!')]
        });
    };

    async searchById (id: any) {
        AnimeValidator.validateId(id);

        const data = await searchMangaById(id);

        await this.interaction.followUp({
            embeds: [new MangaEmbed(data)]
        });
    };

    async searchByName (name: string) {
        AnimeValidator.validateName(name);

        const data = await searchMangaByName(name);

        await this.interaction.followUp({
            embeds: [new MangaEmbed(data)]
        });
    };
};