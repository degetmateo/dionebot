"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Setup_1 = require("../modulos/Setup");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados."),
    execute: async (interaction) => {
        var _a;
        const bot = interaction.client;
        await interaction.deferReply({ ephemeral: true });
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? interaction.guild.id : "";
        const userID = interaction.user.id;
        const usuario = await Setup_1.Setup.UnsetupUsuario(serverID, userID);
        if (!usuario) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }
        bot.eliminarUsuario(usuario);
        return interaction.editReply({
            content: "Listo!",
        });
    }
};
