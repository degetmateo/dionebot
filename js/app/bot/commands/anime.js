"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AnimeCommandInteraction_1 = __importDefault(require("./interactions/anime/AnimeCommandInteraction"));
class CommandAnime {
    constructor() {
        this.name = 'anime';
        this.cooldown = 10;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('anime')
            .setDescription('Busca un anime en la base de datos de anilist.')
            .setDMPermission(false)
            .addStringOption((opcion) => opcion
            .setName('nombre-o-id')
            .setDescription('El nombre o el ID con el que se va a buscar el anime.')
            .setRequired(true))
            .addBooleanOption((opcion) => opcion
            .setName('traducir')
            .setDescription('Si deseas traducir la sinopsis.'));
    }
    async execute(interaction) {
        const commandInteraction = new AnimeCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = CommandAnime;
