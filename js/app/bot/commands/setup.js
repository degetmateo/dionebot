"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SetupCommandInteraction_1 = __importDefault(require("../interactions/setup/SetupCommandInteraction"));
module.exports = {
    cooldown: 0,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('setup')
        .setDescription('Enlaza tu cuenta de anilist.')
        .setDMPermission(false),
    execute: async (interaction) => {
        const commandInteraction = new SetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
