"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AdminSetupCommandInteraction_1 = __importDefault(require("../interactions/admin-setup/AdminSetupCommandInteraction"));
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('admin-setup')
        .setDescription("Enlaza la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option => option
        .setName('usuario')
        .setDescription('Usuario de discord.')
        .setRequired(true))
        .addStringOption(option => option
        .setName('nombre-o-id')
        .setDescription('Nombre o ID del usuario.')
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new AdminSetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
