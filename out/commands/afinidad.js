"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Afinidad_1 = require("../modulos/Afinidad");
const Embeds_1 = require("../modulos/Embeds");
const Usuarios_1 = require("../modulos/Usuarios");
const Usuario_1 = require("../objetos/Usuario");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("afinidad")
        .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
        .addUserOption(option => option
        .setName("usuario")
        .setDescription("Usuario del que quieres calcular la afinidad.")),
    execute: async (interaction) => {
        var _a;
        const bot = interaction.client;
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? interaction.guild.id : "";
        if (bot.isCalculatingAffinity(serverID)) {
            return interaction.reply({
                content: "Ya se está calculando la afinidad de alguien más en este momento.",
                ephemeral: true
            });
        }
        bot.setCalculatingAffinity(serverID, true);
        const usuario = interaction.options.getUser("usuario");
        const userID = usuario == null ? interaction.user.id : usuario.id;
        const uRegistrados = bot.usuarios.filter(u => u.serverId === serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId == userID);
        if (!uRegistrado) {
            bot.setCalculatingAffinity(serverID, false);
            return interaction.reply({
                content: "El usuario no está registrado.",
                ephemeral: true
            });
        }
        await interaction.deferReply();
        const anilistUser = await Usuarios_1.Usuarios.BuscarUsuario(serverID, uRegistrado.anilistUsername);
        if (!anilistUser) {
            bot.setCalculatingAffinity(serverID, false);
            return interaction.editReply({
                content: `No se ha encontrado al usuario **${uRegistrado.anilistUsername}** en la base de datos de ANILIST. Probablemente se haya cambiado el nombre.`
            });
        }
        const aniuser1 = new Usuario_1.Usuario(anilistUser);
        const resultado = await Afinidad_1.Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);
        if (resultado.error) {
            bot.setCalculatingAffinity(serverID, false);
            return interaction.editReply({
                content: "Ha ocurrido un error al intentar calcular la afinidad."
            });
        }
        const EmbedInformacionAfinidad = Embeds_1.Embeds.EmbedAfinidad(aniuser1, resultado.afinidades);
        bot.setCalculatingAffinity(serverID, false);
        return interaction.editReply({
            embeds: [EmbedInformacionAfinidad]
        });
    }
};
