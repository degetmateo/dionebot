"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoManga_1 = __importDefault(require("./modulos/InteraccionComandoManga"));
class ComandoManga {
    constructor() {
        this.cooldown = 10;
        this.datos = new discord_js_1.SlashCommandBuilder()
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
        await InteraccionComandoManga_1.default.execute(interaction);
    }
}
exports.default = ComandoManga;
