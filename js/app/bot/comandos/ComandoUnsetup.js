"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandUnderMaintenanceException_1 = __importDefault(require("../../errores/CommandUnderMaintenanceException"));
class ComandoUnsetup {
    constructor() {
        this.cooldown = 0;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("unsetup")
            .setDescription("Te elimina de los usuarios registrados.");
    }
    async execute(interaction) {
        throw new CommandUnderMaintenanceException_1.default('Comando en mantenimiento.');
    }
}
exports.default = ComandoUnsetup;
