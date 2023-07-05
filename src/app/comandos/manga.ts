import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Media } from "../modulos/Media";
import { Embeds } from "../modulos/Embeds";
import ErrorGenerico from "../errores/ErrorGenerico";
import ErrorSinResultados from "../errores/ErrorSinResultados";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Busca un manga en la base de datos de anilist.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el manga.')
                .setRequired(true))
        .addBooleanOption(opcion => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)')),
    
    execute: async (interaccion: ChatInputCommandInteraction) => {
        await interaccion.deferReply();

        const bot: BOT = interaccion.client as BOT;
        const criterio: string = interaccion.options.getString('nombre-o-id') as string;
        const traducir: boolean = interaccion.options.getBoolean("traducir") || false;
        const idServidor: string = interaccion.guild?.id as string;

        if (bot.isSearchingMedia(idServidor)) throw new ErrorGenerico("Ya se está buscando otra cosa en este momento. Espere hasta que finalice la busqueda.");

        bot.setSearchingMedia(idServidor, true);

        const media = await Media.BuscarMedia('MANGA', criterio);

        if (!media) {
            bot.setSearchingMedia(idServidor, false);
            throw new ErrorSinResultados('No se han encontrado resultados.');
        }

        try {
            const embedInformacion = await Embeds.EmbedInformacionMedia(interaccion, media, traducir);
            interaccion.editReply({ embeds: [embedInformacion] });
            bot.setSearchingMedia(idServidor, false);       
        } catch (error) {
            bot.setSearchingMedia(idServidor, false);
            throw error;
        }
    }
}