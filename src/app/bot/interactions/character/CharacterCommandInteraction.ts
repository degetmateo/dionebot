import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import NoResultsException from "../../../errors/NoResultsException";
import CharacterCommandQueries from "./CharacterCommandQueries";
import { Character } from "../../apis/anilist/tipos/Character";

export default class CharacterCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const characterQuery = this.interaction.options.getString('name-or-id');
        const character = await this.findCharacter(characterQuery);
        const characterEmbed = await this.createEmbed(character);

        await this.interaction.editReply({
            embeds: [characterEmbed]
        });
    }

    private async findCharacter (query: string): Promise<Character> {
        const characterQuery = CharacterCommandQueries.CreateCharacterQuery(query);
        const results = await AnilistAPI.fetch(characterQuery);
        if (results.errors) {
            if (results.errors[0].message.toLowerCase().includes('not found')) throw new NoResultsException('No se ha encontrado ese personaje.');
            throw new Error(results.errors[0].message);
        }
        return new Character(results.data.Character);
    }

    private async createEmbed (character: Character) {
        const embed = new EmbedBuilder();

        const name = character.getName();
        embed.setTitle(name === 'Rena Ryuuguu' ? 'Rena Ryuuguu (Dione)' : name);
        embed.setImage(character.getImageURL());
        embed.setURL(character.getURL());
        embed.setColor(Helpers.getRandomElement(['Blue', 'Red', 'Yellow']));
        embed.setFooter({
            text: `▸ Le gusta a ${character.getFavourites()} usuarios!`
        })

        return embed;
    }
}