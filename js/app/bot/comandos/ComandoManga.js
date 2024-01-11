"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MangaCommandInteraction_1 = __importDefault(require("./interactions/manga/MangaCommandInteraction"));
class ComandoManga {
    constructor() {
        this.cooldown = 10;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('manga')
            .setDescription('Busca un manga en la base de datos de anilist.')
            .addStringOption(opcion => opcion
            .setName('nombre-o-id')
            .setDescription('El nombre o el ID con el que se va a buscar el manga.')
            .setRequired(true))
            .addBooleanOption(opcion => opcion
            .setName('traducir')
            .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)'));
    }
    async execute(interaction) {
        const commandInteraction = new MangaCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = ComandoManga;
