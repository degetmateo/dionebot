"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const VNCommandInteraction_1 = __importDefault(require("../interactions/vn/VNCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('vn')
        .setDescription('Search for a visual novel!')
        .setDescription('Busca una novela visual!')
        .setDMPermission(false)
        .addStringOption(option => option
        .setName('name-or-id')
        .setNameLocalization('es-ES', 'nombre-o-id')
        .setDescription('Name or id of the visual novel you want to search for.')
        .setDescription('Nombre o id de la novela visual a la que quieres buscar.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new VNCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
