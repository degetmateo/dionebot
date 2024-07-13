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
const postgres_1 = __importDefault(require("../../../database/postgres"));
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
        embed.setTitle(name === 'Rena Ryuuguu' ? 'Dione' : name);
        embed.setImage(character.getImageURL());
        embed.setURL(character.getURL());
        embed.setColor(Helpers_1.default.getRandomElement(['Blue', 'Red', 'Yellow']));
        embed.setFooter({
            text: `▸ Fue marcado ${character.getFavourites()} veces.`
        });
        return embed;
    }
    createCollector(res, character) {
        const collector = res.createMessageComponentCollector({
            time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
        });
        collector.on('collect', async (button) => {
            await button.deferReply({ ephemeral: true });
            if (button.customId === 'buttonFavs') {
                const favs = await this.findCharacterFavs(character);
                const usernames = await this.getUsernames(favs);
                const embed = this.createEmbedFavs(usernames);
                await button.editReply({
                    embeds: [embed]
                });
            }
        });
    }
    async findCharacterFavs(character) {
        const users = await postgres_1.default.query() `
            SELECT du.id_user, du.id_anilist FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${this.interaction.guild.id} and
                mem.id_user = du.id_user;  
        `;
        const query = CharacterCommandQueries_1.default.CreateCharacterFavouritesQuery(users);
        const characterFavs = new Array();
        const results = await AnilistAPI_1.default.fetch(query);
        for (const q in results.data) {
            const qUser = results.data[q].users[0];
            if (!qUser)
                continue;
            const userFavs = qUser.favourites.characters.nodes;
            if (!userFavs || userFavs.length <= 0)
                continue;
            if (userFavs.find(fav => fav.id === character.getId())) {
                characterFavs.push(users.find(u => u.id_anilist == qUser.id).id_user);
            }
            ;
        }
        return characterFavs;
    }
    async getUsernames(usersIds) {
        const bot = this.interaction.client;
        const usernames = await Helpers_1.default.asyncMap(usersIds, async (id) => (await bot.fetchUser(id)).username);
        return usernames;
    }
    createEmbedFavs(usernames) {
        const embed = new discord_js_1.EmbedBuilder();
        embed.setColor(Helpers_1.default.getRandomElement(['Blue', 'Red', 'Yellow']));
        const description = usernames.map(name => `♥ ${name}`).join('\n');
        embed.setDescription(usernames.length > 0 ? description : 'Nadie lo ha marcado en este servidor... 💔');
        return embed;
    }
}
exports.default = CharacterCommandInteraction;
