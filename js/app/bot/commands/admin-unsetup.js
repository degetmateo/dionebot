"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AdminUnsetupCommandInteraction_1 = __importDefault(require("./interactions/admin-unsetup/AdminUnsetupCommandInteraction"));
class CommandAdminUnsetup {
    constructor() {
        this.name = 'admin-unsetup';
        this.cooldown = 5;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('admin-unsetup')
            .setDescription("Elimina la cuenta de anilist de un usuario.")
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
            .setDMPermission(false)
            .addUserOption(option => option
            .setName('usuario')
            .setDescription('Usuario de discord.')
            .setRequired(true));
    }
    async execute(interaction) {
        const commandInteraction = new AdminUnsetupCommandInteraction_1.default(interaction);
        await commandInteraction.execute();
    }
}
exports.default = CommandAdminUnsetup;
