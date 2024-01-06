"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandUnderMaintenanceException_1 = __importDefault(require("../../errores/CommandUnderMaintenanceException"));
class ComandoSetup {
    constructor() {
        this.cooldown = 0;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("setup")
            .setDescription("Enlaza tu cuenta de una de estas plataformas.")
            .addStringOption(option => option
            .setName('plataforma')
            .setDescription('Plataformas actualmente disponibles.')
            .addChoices({ name: 'Anilist', value: 'Anilist' }, { name: 'MyAnimeList', value: 'MyAnimeList' }, { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
            .setRequired(true))
            .addStringOption(option => option
            .setName('nombre-o-id')
            .setDescription('Tu nombre o ID de usuario.')
            .setRequired(true));
    }
    async execute(interaction) {
        throw new CommandUnderMaintenanceException_1.default('Comando en mantenimiento.');
    }
}
exports.default = ComandoSetup;
