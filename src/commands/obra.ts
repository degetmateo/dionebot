import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Embeds } from "../modulos/Embeds";
import { Media } from "../modulos/Media";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("obra")
        .setDescription("Busca una obra en la base de datos de anilist.")
        .addSubcommand(subcommand => 
            subcommand
                .setName("por-nombre")
                .setDescription("Busqueda por nombre.")
                .addStringOption(option => 
                    option
                        .setName("tipo")
                        .setDescription("Tipo de media a buscar.")
                        .addChoices({ name: "ANIME", value: "ANIME" }, 
                                    { name: "MANGA", value: "MANGA" })
                        .setRequired(true))
                .addStringOption(option => 
                    option
                        .setName("nombre")
                        .setDescription("Nombre del anime o manga.")
                        .setRequired(true))
                .addBooleanOption(option => 
                    option
                        .setName("traducir")
                        .setDescription("Traducir la información obtenida.")))
        .addSubcommand(subcommand => 
            subcommand
                .setName("por-id")
                .setDescription("Busqueda por ID.")
                .addStringOption(option => 
                    option
                        .setName("tipo")
                        .setDescription("Tipo de media a buscar.")
                        .addChoices({ name: "ANIME", value: "ANIME" }, 
                                    { name: "MANGA", value: "MANGA" })
                        .setRequired(true))
                .addIntegerOption(option => 
                    option
                        .setName("id")
                        .setDescription("ID del anime o manga.")
                        .setRequired(true))
                .addBooleanOption(option => 
                    option
                        .setName("traducir")
                        .setDescription("Traducir la información obtenida."))),

    execute: async (interaction: ChatInputCommandInteraction, bot: BOT) => {
        await interaction.deferReply();
        
        const tipo = interaction.options.getString("tipo");
        const traducir = interaction.options.getBoolean("traducir") ? true : false;
        const subcommand = interaction.options.getSubcommand();

        if (!tipo) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }

        const serverID = interaction.guild?.id;

        if (!serverID) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }

        if (bot.estaBuscandoMedia(serverID)) {
            return interaction.editReply({
                content: "Ya se está buscando otra obra en este momento.",
            });
        }

        bot.setBuscandoMedia(serverID, true);

        let media;

        if (subcommand === "por-nombre") {
            const nombre = interaction.options.getString("nombre");

            if (!nombre) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                });
            }

            media = await Media.BuscarMedia(tipo, nombre);
        }

        if (subcommand === "por-id") {
            const id = interaction.options.getInteger("id")?.toString();
            
            if (!id) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                })
            }

            media = await Media.BuscarMedia(tipo, id);
        }

        if (!media) {
            bot.setBuscandoMedia(serverID, false);
            return interaction.editReply({
                content: "No se han encontrado resultados.",
            });
        }

        const embedInformacion = await Embeds.EmbedInformacionMedia(interaction, media, traducir);
        interaction.editReply({ embeds: [embedInformacion] });
        bot.setBuscandoMedia(serverID, false);
    }
}