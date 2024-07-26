"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const CharacterCommandQueries_1 = __importDefault(require("./CharacterCommandQueries"));
const Character_1 = require("../../apis/anilist/tipos/Character");
class CharacterCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const characterQuery = this.interaction.options.getString('name-or-id');
        const character = await this.findCharacter(characterQuery);
        const characterEmbed = await this.createEmbed(character);
        await this.interaction.editReply({
            embeds: [characterEmbed]
        });
    }
    async findCharacter(query) {
        const characterQuery = CharacterCommandQueries_1.default.CreateCharacterQuery(query);
        const results = await AnilistAPI_1.default.fetch(characterQuery);
        if (results.errors) {
            if (results.errors[0].message.toLowerCase().includes('not found'))
                throw new NoResultsException_1.default('No se ha encontrado ese personaje.');
            throw new Error(results.errors[0].message);
        }
        return new Character_1.Character(results.data.Character);
    }
    async createEmbed(character) {
        const embed = new discord_js_1.EmbedBuilder();
        const name = character.getName();
        embed.setTitle(name === 'Rena Ryuuguu' ? 'Rena Ryuuguu (Dione)' : name);
        embed.setImage(character.getImageURL());
        embed.setURL(character.getURL());
        embed.setColor(Helpers_1.default.getRandomElement(['Blue', 'Red', 'Yellow']));
        embed.setFooter({
            text: `▸ Le gusta a ${character.getFavourites()} usuarios!`
        });
        return embed;
    }
}
exports.default = CharacterCommandInteraction;
