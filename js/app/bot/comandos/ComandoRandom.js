"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoRandom_1 = __importDefault(require("./modulos/InteraccionComandoRandom"));
class ComandoRandom {
    constructor() {
        this.nombre = 'random';
        this.cooldown = 10;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('random')
            .setDescription('Elije al azar un anime para que veas de tus PTW.');
    }
    async execute(interaction) {
        const commandInteraction = new InteraccionComandoRandom_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = ComandoRandom;
