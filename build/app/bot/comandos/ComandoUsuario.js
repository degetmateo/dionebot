"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoUsuario_1 = __importDefault(require("./modulos/InteraccionComandoUsuario"));
class ComandoUsuario {
    constructor() {
        this.cooldown = 5;
        this.datos = new discord_js_1.SlashCommandBuilder()
            .setName("usuario")
            .setDescription("Muestra la información del perfil de Anilist de un usuario.")
            .addUserOption(option => option
            .setName("usuario")
            .setDescription("El usuario del que se solicita la información."));
    }
    async execute(interaction) {
        await InteraccionComandoUsuario_1.default.execute(interaction);
    }
}
exports.default = ComandoUsuario;
