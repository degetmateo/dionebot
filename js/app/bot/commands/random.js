"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const RandomCommandInteraction_1 = __importDefault(require("./interactions/random/RandomCommandInteraction"));
class CommandRandom {
    constructor() {
        this.name = 'random';
        this.cooldown = 10;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('random')
            .setDescription('Elije al azar un anime para que veas de tus PTW.')
            .setDMPermission(false);
    }
    async execute(interaction) {
        const commandInteraction = new RandomCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = CommandRandom;
