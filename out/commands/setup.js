"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Setup_1 = require("../modulos/Setup");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("setup")
        .setDescription("Registra tu usuario de ANILIST en este servidor.")
        .addStringOption(option => option
        .setName("username")
        .setDescription("Tu nombre de usuario de ANILIST.")
        .setRequired(true)),
    execute: async (interaction) => {
        var _a, _b;
        const bot = interaction.client;
        await interaction.deferReply({ ephemeral: true });
        const username = interaction.options.getString("username");
        if (!username) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id : "";
        const userID = interaction.user.id;
        const resultado = await Setup_1.Setup.SetupUsuario(username, serverID, userID);
        if (!resultado) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }
        await bot.loadUsers();
        return interaction.editReply({
            content: "Listo!",
        });
    }
};
