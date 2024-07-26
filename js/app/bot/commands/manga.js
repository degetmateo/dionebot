"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MangaCommandInteraction_1 = __importDefault(require("../interactions/manga/MangaCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('manga')
        .setDescription('Search for a manga!')
        .setDescriptionLocalization('es-ES', 'Busca un manga!')
        .setDMPermission(false)
        .setNSFW(false)
        .addStringOption((option) => option
        .setName('name-or-id')
        .setNameLocalization('es-ES', 'nombre-o-id')
        .setDescription('Name or id of the manga you want to search for.')
        .setDescriptionLocalization('es-ES', 'Nombre o id del manga que quieres buscar.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new MangaCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
