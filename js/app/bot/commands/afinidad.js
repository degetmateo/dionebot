"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AfinidadCommandInteraction_1 = __importDefault(require("../interactions/afinidad/AfinidadCommandInteraction"));
module.exports = {
    cooldown: 20,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('afinidad')
        .setDescription('Calcula la afinidad entre ti (u otro usuario) y los demás miembros registrados del servidor.')
        .setDMPermission(false)
        .addUserOption(option => option
        .setName('usuario')
        .setDescription('Usuario del cual quieres calcular la afinidad.')),
    execute: async (interaction) => {
        const commandInteraction = new AfinidadCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
