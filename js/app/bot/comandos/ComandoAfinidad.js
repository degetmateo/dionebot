"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AfinidadCommandInteraction_1 = __importDefault(require("./interactions/afinidad/AfinidadCommandInteraction"));
class ComandoAfinidad {
    constructor() {
        this.cooldown = 20;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("afinidad")
            .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
            .addUserOption(option => option
            .setName("usuario")
            .setDescription("Usuario del que quieres calcular la afinidad."));
    }
    async execute(interaction) {
        const commandInteraction = new AfinidadCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = ComandoAfinidad;
