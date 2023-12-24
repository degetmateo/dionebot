"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoAfinidad_1 = __importDefault(require("./modulos/InteraccionComandoAfinidad"));
class ComandoAfinidad {
    constructor() {
        this.cooldown = 10;
        this.datos = new discord_js_1.SlashCommandBuilder()
            .setName("afinidad")
            .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
            .addUserOption(option => option
            .setName("usuario")
            .setDescription("Usuario del que quieres calcular la afinidad."));
    }
    async execute(interaction) {
        await InteraccionComandoAfinidad_1.default.execute(interaction);
    }
}
exports.default = ComandoAfinidad;
