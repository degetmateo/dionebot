"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Media_1 = require("../modulos/Media");
const Embeds_1 = require("../modulos/Embeds");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
        .addStringOption(opcion => opcion
        .setName('nombre-o-id')
        .setDescription('El nombre o el ID con el que se va a buscar el anime.')
        .setRequired(true))
        .addBooleanOption(opcion => opcion
        .setName('traducir')
        .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)')),
    execute: async (interaccion) => {
        var _a;
        const bot = interaccion.client;
        const traducir = interaccion.options.getBoolean("traducir") ? true : false;
        const idServidor = (_a = interaccion.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!idServidor) {
            return interaccion.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        if (bot.isSearchingMedia(idServidor)) {
            return interaccion.reply({
                content: "Ya se está buscando otra obra en este momento.",
                ephemeral: true
            });
        }
        await interaccion.deferReply();
        bot.setSearchingMedia(idServidor, true);
        const criterio = interaccion.options.getString('nombre-o-id');
        if (!criterio) {
            bot.setSearchingMedia(idServidor, false);
            return interaccion.editReply({
                content: 'Ha ocurrido un error.',
            });
        }
        const media = await Media_1.Media.BuscarMedia('ANIME', criterio);
        if (!media) {
            bot.setSearchingMedia(idServidor, false);
            return interaccion.editReply({
                content: "No se han encontrado resultados."
            });
        }
        const embedInformacion = await Embeds_1.Embeds.EmbedInformacionMedia(interaccion, media, traducir);
        interaccion.editReply({ embeds: [embedInformacion] });
        bot.setSearchingMedia(idServidor, false);
    }
};
