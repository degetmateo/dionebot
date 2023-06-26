"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const colornames_1 = __importDefault(require("colornames"));
const Usuarios_1 = require("../modulos/Usuarios");
const UsuarioAnilist_1 = require("../objetos/UsuarioAnilist");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => option
        .setName("usuario")
        .setDescription("El usuario del que se solicita la información.")),
    execute: async (interaction) => {
        var _a;
        const usuario = interaction.options.getUser("usuario");
        const idServidor = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!idServidor) {
            throw new Error('No se ha podido obtener la ID del servidor.');
        }
        await interaction.deferReply();
        let usuarioAnilist;
        if (!usuario) {
            usuarioAnilist = new UsuarioAnilist_1.UsuarioAnilist(await Usuarios_1.Usuarios.BuscarUsuario(idServidor, interaction.user.id));
        }
        else {
            usuarioAnilist = new UsuarioAnilist_1.UsuarioAnilist(await Usuarios_1.Usuarios.BuscarUsuario(idServidor, usuario.id));
        }
        if (!usuarioAnilist.getData()) {
            return interaction.editReply({
                content: "No se ha encontrado al usuario.",
            });
        }
        const hexColor = colornames_1.default.get(usuarioAnilist.getColorName()).value;
        const color = "0x" + hexColor;
        const stats = usuarioAnilist.getEstadisticas();
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(usuarioAnilist.getNombre())
            .setURL(usuarioAnilist.getURL())
            .setColor(color)
            .setThumbnail(usuarioAnilist.getAvatarURL())
            .setImage(usuarioAnilist.getBannerImage())
            .setDescription(usuarioAnilist.getBio())
            .addFields({
            name: "Animes",
            value: `‣ Vistos: ${stats.anime.count}\n‣ Nota Promedio: ${stats.anime.meanScore}\n‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}\n‣ Episodios Totales: ${stats.anime.episodesWatched}`,
            inline: false
        }, {
            name: "Mangas",
            value: `‣ Leídos: ${stats.manga.count}\n‣ Nota Promedio: ${stats.manga.meanScore}\n‣ Capítulos Leídos: ${stats.manga.chaptersRead}\n‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
            inline: false
        });
        return interaction.editReply({
            embeds: [embed]
        });
    }
};
