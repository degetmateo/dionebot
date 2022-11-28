"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Setup_1 = require("../modulos/Setup");
const Usuarios_1 = require("../modulos/Usuarios");
const Usuario_1 = require("../objetos/Usuario");
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
        const username = interaction.options.getString("username", true);
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id : "";
        const userID = interaction.user.id;
        const uRegistrados = bot.getUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
        if (uRegistrado) {
            return interaction.editReply({
                content: "Ya te encuentras registrado."
            });
        }
        const anilistUser = await Usuarios_1.Usuarios.BuscarUsuario(serverID, username);
        if (!anilistUser) {
            return interaction.editReply({
                content: "No se ha encontrado ese usuario en ANILIST."
            });
        }
        const usuario = new Usuario_1.Usuario(anilistUser);
        try {
            await Setup_1.Setup.SetupUsuario(usuario, serverID, userID);
        }
        catch (err) {
            console.error(err);
            return interaction.editReply({
                content: "Ha ocurrido un error al intentar registrarte. Intentalo más tarde.",
            });
        }
        const newUsuarioRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.getNombre(),
            anilistId: usuario.getID()
        };
        bot.insertarUsuario(newUsuarioRegistrado);
        return interaction.editReply({
            content: "Listo! Ya estás registrado.",
        });
    }
};
