"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UnsetupCommandInteraction_1 = __importDefault(require("./interactions/unsetup/UnsetupCommandInteraction"));
class ComandoUnsetup {
    constructor() {
        this.cooldown = 5;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("unsetup")
            .setDescription("Te elimina de los usuarios registrados.");
    }
    async execute(interaction) {
        const commandInteraction = new UnsetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = ComandoUnsetup;
