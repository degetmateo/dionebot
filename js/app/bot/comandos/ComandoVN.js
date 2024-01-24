"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const VNCommandInteraction_1 = __importDefault(require("./interactions/vn/VNCommandInteraction"));
class ComandoVN {
    constructor() {
        this.cooldown = 10;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('vn')
            .setDescription('Obtén información acerca de una novela visual.')
            .addStringOption(opcion => opcion
            .setName('nombre-o-id')
            .setDescription('El nombre o el ID con el que se va a buscar la novela visual.')
            .setRequired(true))
            .addBooleanOption(opcion => opcion
            .setName('traducir')
            .setDescription('Indicar si la información obtenida debe traducirse al español.'));
    }
    async execute(interaction) {
        const commandInteraction = new VNCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = ComandoVN;
