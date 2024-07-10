"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AffinityCommandInteraction_1 = __importDefault(require("../interactions/affinity/AffinityCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('affinity')
        .setNameLocalization('es-ES', 'afinidad')
        .setDescription('See what your affinity with an user looks like.')
        .setDescriptionLocalization('es-ES', 'Calcula tu afinidad con otro usuario.')
        .setDMPermission(false)
        .setNSFW(false)
        .addUserOption(option => option
        .setName('user')
        .setNameLocalization('es-ES', 'usuario')
        .setDescription('User you want to calculate your affinity with.')
        .setDescriptionLocalization('es-ES', 'Usuario con el que quieres calcular tu afinidad.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new AffinityCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
