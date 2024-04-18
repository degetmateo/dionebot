"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SeasonCommandInteraction_1 = __importDefault(require("../interactions/season/SeasonCommandInteraction"));
module.exports = {
    cooldown: 10,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('season')
        .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
        .setDMPermission(false)
        .addIntegerOption(option => option
        .setName("año")
        .setDescription("El año en el que se emitieron los animes.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("temporada")
        .setDescription("La temporada en la que se emitieron los animes.")
        .addChoices({ name: "PRIMAVERA", value: "SPRING" }, { name: "VERANO", value: "SUMMER" }, { name: "INVIERNO", value: "WINTER" }, { name: "OTOÑO", value: "FALL" })
        .setRequired(true)),
    execute: async (interaction) => {
        const commandInteraction = new SeasonCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
};
