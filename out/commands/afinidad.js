"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
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
    execute: async (interaction, bot) => {
        var _a;
        await interaction.deferReply();
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? interaction.guild.id : "";
        const usuario = interaction.options.getUser("usuario");
        // if (bot.estaBuscandoAfinidad(serverID)) {
        //     return interaction.editReply({
        //         content: "Ya se está calculando la afinidad de alguien más en este momento.",
        //         options: { ephemeral: true }
        //     })
        // }
        bot.setBuscandoAfinidad(serverID, true);
        const userID = usuario == null ? interaction.user.id : usuario.id;
        const uRegistrados = await Aniuser_1.default.find({ serverId: serverID });
        const uRegistrado = uRegistrados.find(u => u.discordId == userID);
        if (!uRegistrado) {
            bot.setBuscandoAfinidad(serverID, false);
            return interaction.editReply({
                content: "El usuario no está registrado.",
            });
        }
        if (!uRegistrado.anilistUsername) {
            bot.setBuscandoAfinidad(serverID, false);
            console.error("[ERROR] Usuario registrado sin usuario de ANILIST.");
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }
        const aniuser1 = new Usuario_1.Usuario(await Usuarios_1.Usuarios.BuscarUsuario(serverID, uRegistrado.anilistUsername));
        if (!aniuser1) {
            bot.setBuscandoAfinidad(serverID, false);
            return interaction.editReply({
                content: `No se ha encontrado al usuario **${uRegistrado.anilistUsername}** en ANILIST. Probablemente se haya cambiado el nombre.`,
            });
        }
        const resultado = await Afinidad_1.Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);
        if (resultado.error) {
            bot.setBuscandoAfinidad(serverID, false);
            return interaction.editReply({
                content: "Ha ocurrido un error al calcular la afinidad."
            });
        }
        const EmbedInformacionAfinidad = Embeds_1.Embeds.EmbedAfinidad(aniuser1, resultado.afinidades);
        bot.setBuscandoAfinidad(serverID, false);
        return interaction.editReply({
            embeds: [EmbedInformacionAfinidad]
        });
    }
};
