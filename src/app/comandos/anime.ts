import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Media } from "../modulos/Media";
import { Embeds } from "../modulos/Embeds";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el anime.')
                .setRequired(true))
        .addBooleanOption(opcion => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)')),
    
    execute: async (interaccion: ChatInputCommandInteraction) => {
        const bot = interaccion.client as BOT;

        const traducir = interaccion.options.getBoolean("traducir") ? true : false;

        const idServidor = interaccion.guild?.id;

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
            })
        }

        const media = await Media.BuscarMedia('ANIME', criterio);

        if (!media) {
            bot.setSearchingMedia(idServidor, false);

            return interaccion.editReply({
                content: "No se han encontrado resultados."
            })
        }

        try {
            const embedInformacion = await Embeds.EmbedInformacionMedia(interaccion, media, traducir);
            interaccion.editReply({ embeds: [embedInformacion] });
            bot.setSearchingMedia(idServidor, false);       
        } catch (error) {
            bot.setSearchingMedia(idServidor, false);
            console.error(error);   
        }
    }
}