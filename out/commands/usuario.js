"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../modulos/Embeds");
const Usuarios_1 = require("../modulos/Usuarios");
const Usuario_1 = require("../objetos/Usuario");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Devuelve la información de ANILIST de un usuario.")
        .addUserOption(option => option
        .setName("usuario")
        .setDescription("El usuario del que se solicita la información.")),
    execute: async (interaction) => {
        var _a;
        const userInteraction = interaction.options.getUser("usuario");
        const serverID = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!serverID) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        interaction.deferReply();
        let usuario;
        if (!userInteraction) {
            usuario = await Usuarios_1.Usuarios.BuscarUsuario(serverID, interaction.user.id);
        }
        else {
            usuario = await Usuarios_1.Usuarios.BuscarUsuario(serverID, userInteraction.id);
        }
        if (!usuario) {
            return interaction.editReply({
                content: "No se ha encontrado al usuario.",
            });
        }
        usuario = new Usuario_1.Usuario(usuario);
        const embed = Embeds_1.Embeds.EmbedInformacionUsuario(usuario);
        return interaction.editReply({
            embeds: [embed]
        });
    }
};
