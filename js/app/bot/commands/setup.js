"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SetupCommandInteraction_1 = __importDefault(require("../interactions/setup/SetupCommandInteraction"));
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('setup')
        .setDescription("Enlaza tu cuenta de una de estas plataformas.")
        .setDMPermission(false)
        .addStringOption(option => option
        .setName('plataforma')
        .setDescription('Plataformas actualmente disponibles.')
        .addChoices({ name: 'Anilist', value: 'Anilist' }, { name: 'MyAnimeList', value: 'MyAnimeList' }, { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
        .setRequired(true))
        .addStringOption(option => option
        .setName('nombre-o-id')
        .setDescription('Tu nombre o ID de usuario.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new SetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
