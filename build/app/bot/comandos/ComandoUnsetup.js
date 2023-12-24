"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComandoUnsetup_1 = __importDefault(require("./modulos/InteraccionComandoUnsetup"));
class ComandoUnsetup {
    constructor() {
        this.cooldown = 0;
        this.datos = new discord_js_1.SlashCommandBuilder()
            .setName("unsetup")
            .setDescription("Te elimina de los usuarios registrados.");
    }
    async execute(interaction) {
        await InteraccionComandoUnsetup_1.default.execute(interaction);
    }
}
exports.default = ComandoUnsetup;
