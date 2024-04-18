"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const RandomCommandInteraction_1 = __importDefault(require("../interactions/random/RandomCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('random')
        .setDescription('Elije al azar un anime para que veas de tus PTW.')
        .setDMPermission(false),
    execute: async (interaction) => {
        const commandInteraction = new RandomCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
