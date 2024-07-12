"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CharacterCommandInteraction_1 = __importDefault(require("../interactions/character/CharacterCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('character')
        .setNameLocalization('es-ES', 'personaje')
        .setDescription('Search for a character in anilist!')
        .setDescriptionLocalization('es-ES', 'Busca un personaje en anilist!')
        .setNSFW(false)
        .setDMPermission(false)
        .addStringOption(option => option
        .setName('name-or-id')
        .setNameLocalization('es-ES', 'nombre-o-id')
        .setDescription('Name or id of the character you want to search for.')
        .setDescriptionLocalization('es-ES', 'Nombre o id del personaje al que quieres buscar.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new CharacterCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
