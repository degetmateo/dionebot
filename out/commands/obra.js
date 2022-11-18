"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embeds_1 = require("../modulos/Embeds");
const Media_1 = require("../modulos/Media");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("obra")
        .setDescription("Busca una obra en la base de datos de anilist.")
        .addSubcommand(subcommand => subcommand
        .setName("por-nombre")
        .setDescription("Busqueda por nombre.")
        .addStringOption(option => option
        .setName("tipo")
        .setDescription("Tipo de media a buscar.")
        .addChoices({ name: "ANIME", value: "ANIME" }, { name: "MANGA", value: "MANGA" })
        .setRequired(true))
        .addStringOption(option => option
        .setName("nombre")
        .setDescription("Nombre del anime o manga.")
        .setRequired(true))
        .addBooleanOption(option => option
        .setName("traducir")
        .setDescription("Traducir la información obtenida.")))
        .addSubcommand(subcommand => subcommand
        .setName("por-id")
        .setDescription("Busqueda por ID.")
        .addStringOption(option => option
        .setName("tipo")
        .setDescription("Tipo de media a buscar.")
        .addChoices({ name: "ANIME", value: "ANIME" }, { name: "MANGA", value: "MANGA" })
        .setRequired(true))
        .addIntegerOption(option => option
        .setName("id")
        .setDescription("ID del anime o manga.")
        .setRequired(true))
        .addBooleanOption(option => option
        .setName("traducir")
        .setDescription("Traducir la información obtenida."))),
    execute: async (interaction, bot) => {
        var _a, _b;
        const tipo = interaction.options.getString("tipo");
        const traducir = interaction.options.getBoolean("traducir") ? true : false;
        const subcommand = interaction.options.getSubcommand();
        if (!tipo) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        const serverID = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        if (!serverID) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        if (bot.isSearchingMedia(serverID)) {
            return interaction.reply({
                content: "Ya se está buscando otra obra en este momento.",
                ephemeral: true
            });
        }
        await interaction.deferReply();
        bot.setSearchingMedia(serverID, true);
        let media;
        if (subcommand === "por-nombre") {
            const nombre = interaction.options.getString("nombre");
            if (!nombre) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                });
            }
            media = await Media_1.Media.BuscarMedia(tipo, nombre);
        }
        if (subcommand === "por-id") {
            const id = (_b = interaction.options.getInteger("id")) === null || _b === void 0 ? void 0 : _b.toString();
            if (!id) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                });
            }
            media = await Media_1.Media.BuscarMedia(tipo, id);
        }
        if (!media) {
            bot.setSearchingMedia(serverID, false);
            return interaction.editReply({
                content: "No se han encontrado resultados.",
            });
        }
        const embedInformacion = await Embeds_1.Embeds.EmbedInformacionMedia(interaction, media, traducir);
        interaction.editReply({ embeds: [embedInformacion] });
        bot.setSearchingMedia(serverID, false);
    }
};
