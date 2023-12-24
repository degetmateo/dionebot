"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoSeason_1 = __importDefault(require("./modulos/InteraccionComandoSeason"));
class ComandoSeason {
    constructor() {
        this.cooldown = 10;
        this.datos = new discord_js_1.SlashCommandBuilder()
            .setName("season")
            .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
            .addIntegerOption(option => option
            .setName("año")
            .setDescription("El año en el que se emitieron los animes.")
            .setRequired(true))
            .addStringOption(option => option
            .setName("temporada")
            .setDescription("La temporada en la que se emitieron los animes.")
            .addChoices({ name: "PRIMAVERA", value: "SPRING" }, { name: "VERANO", value: "SUMMER" }, { name: "INVIERNO", value: "WINTER" }, { name: "OTOÑO", value: "FALL" })
            .setRequired(true));
    }
    async execute(interaction) {
        await InteraccionComandoSeason_1.default.execute(interaction);
    }
}
exports.default = ComandoSeason;
