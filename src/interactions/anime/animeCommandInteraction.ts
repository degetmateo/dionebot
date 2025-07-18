import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import AnimeEmbed from "../../embeds/animeEmbed";
import searchAnimeById from "./searchAnimeById";
import searchAnimeByName from "./searchAnimeByName";
import SuccessEmbed from "../../embeds/successEmbed";

export default class AnimeCommandInteraction {
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

        const data = await searchAnimeById(id);

        await this.interaction.channel.send({
            embeds: [new AnimeEmbed(data)]
        });
    };

    async searchByName (name: string) {
        AnimeValidator.validateName(name);

        const data = await searchAnimeByName(name);

        await this.interaction.channel.send({
            embeds: [new AnimeEmbed(data)]
        });
    };
};