"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AdminSetupCommandInteraction_1 = __importDefault(require("./interactions/admin-setup/AdminSetupCommandInteraction"));
class CommandAdminSetup {
    constructor() {
        this.name = 'admin-setup';
        this.cooldown = 5;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('admin-setup')
            .setDescription("Registra la cuenta de anilist de un usuario.")
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
            .setDMPermission(false)
            .addStringOption(option => option
            .setName('plataforma')
            .setDescription('Plataformas.')
            .addChoices({ name: 'Anilist', value: 'Anilist' }, { name: 'MyAnimeList', value: 'MyAnimeList' }, { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
            .setRequired(true))
            .addUserOption(option => option
            .setName('usuario')
            .setDescription('Usuario de discord.')
            .setRequired(true))
            .addStringOption(option => option
            .setName('nombre-o-id')
            .setDescription('Nombre o ID del usuario en la plataforma.')
            .setRequired(true));
    }
    async execute(interaction) {
        const commandInteraction = new AdminSetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = CommandAdminSetup;
