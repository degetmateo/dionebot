import { ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import searchMangaByName from "./searchMangaByName";
import searchMangaById from "./searchMangaById";
import MangaEmbed from "../../embeds/mangaEmbed";
import SuccessEmbed from "../../embeds/successEmbed";
import MangaCarrousel from "./mangaCarrousel";
import GenericError from "../../errors/genericError";

export default class MangaCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        const response = await this.interaction.reply({
            embeds: [new SuccessEmbed('Buscando...')],
            withResponse: true
        });

        const args = this.interaction.options.getString('name-or-id') as string;
        
        Helpers.isNumber(args) ?
            await this.searchById(args) :
            await this.searchByName(args);

        await response.resource.message.edit({
            embeds: [new SuccessEmbed('¡Resultados listos!')]
        });
    };

    async searchById (id: any) {
        AnimeValidator.validateId(id);
        const data = await searchMangaById(id);
        await this.interaction.channel.send({
            embeds: [new MangaEmbed(data)]
        });
    };

    async searchByName (name: string) {
        AnimeValidator.validateName(name);
        const data: { media: any[] } = await searchMangaByName(name);
        if (data.media.length <= 0) throw new GenericError('No se han encontrado resultados.');
        const carrousel = new MangaCarrousel(this.interaction, data.media);
        await carrousel.execute();
    };
};