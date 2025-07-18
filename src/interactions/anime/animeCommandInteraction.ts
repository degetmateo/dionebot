import { ChatInputCommandInteraction } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import AnimeEmbed from "../../embeds/animeEmbed";
import searchAnimeById from "./searchAnimeById";
import searchAnimeByName from "./searchAnimeByName";

export default class AnimeCommandInteraction {
    private interaction: ChatInputCommandInteraction;
    
    constructor (interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        // await this.interaction.deferReply();

        const args = this.interaction.options.getString('name-or-id') as string;
        
        await this.interaction.editReply({
            content: "AnimeCommandInteraction.Helpers.IsNumber"
        });

        Helpers.isNumber(args) ?
            await this.searchById(args) :
            await this.searchByName(args);
    };

    async searchById (id: any) {
        AnimeValidator.validateId(id);

        await this.interaction.editReply({
            content: "AnimeCommandInteraction.SearchById"
        });

        const data = await searchAnimeById(id);

        await this.interaction.editReply({
            content: "AnimeCommandInteraction.interaction.FollowUp"
        });

        await this.interaction.editReply({
            embeds: [new AnimeEmbed(data)]
        });
    };

    async searchByName (name: string) {
        AnimeValidator.validateName(name);

        await this.interaction.editReply({
            content: "AnimeCommandInteraction.SearchByName"
        });

        const data = await searchAnimeByName(name);

        await this.interaction.editReply({
            content: "AnimeCommandInteraction.interaction.FollowUp"
        });

        await this.interaction.editReply({
            embeds: [new AnimeEmbed(data)]
        });
    };
};