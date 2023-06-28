import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, normalizeArray } from "discord.js";
import fetch from "node-fetch";
import BOT from "../bot";
import ISO6391 from 'iso-639-1';

import { esNumero, traducir } from "../helpers";
import NovelaVisual from "../media/NovelaVisual";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Obtén información acerca de una novela visual.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar la novela visual.')
                .setRequired(true))
        .addBooleanOption(opcion =>
            opcion
                .setName('traducir')
                .setDescription('Indicar si la información obtenida debe traducirse al español.')),

    execute: async (interaccion: ChatInputCommandInteraction) => {
        const bot = interaccion.client as BOT;

        await interaccion.deferReply();

        const criterio = interaccion.options.getString('nombre-o-id');

        if (!criterio) throw new Error('No se ha encontrado el criterio de busqueda.');

        const traducirSinopsis = interaccion.options.getBoolean('traducir') || false;
        
        let tipoCriterio: 'search' | 'id';

        esNumero(criterio) ? tipoCriterio = 'id' : tipoCriterio = 'search';

        const apiURL = 'https://api.vndb.org/kana/vn';

        const peticion = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            
            body: JSON.stringify({ 
                "filters": [tipoCriterio, "=", criterio],
                "fields": "title, image.url, devstatus, description, aliases, released, languages, platforms, length_minutes, rating, popularity"
            })
        };

        const peticionVN = await fetch(apiURL, peticion);
        const respuesta = await peticionVN.json();

        const resultado = respuesta.results[0]

        if (!resultado) {
            return interaccion.editReply({
                content: 'No se han encontrado resultados.'
            })
        }

        const vn = new NovelaVisual(resultado);

        const embed = new EmbedBuilder()
            .setTitle(vn.getTitulo())
            .setURL(vn.getURL())
            .setDescription(traducirSinopsis ?  await vn.getDescripcionTraducida() : vn.getDescripcion())
            .setThumbnail(vn.getImagenURL())
            .setColor(vn.getColorEstado());
    
        const informacionCampos1 = `
            ‣ **Estado**: ${vn.getEstado()}\n‣ **Calificación**: ${vn.getCalificacion()}/100\n‣ **Popularidad**: ${vn.getPopularidad()}
        `;

        const informacionCampos2 = `
            ‣ **Fecha de Salida**: ${vn.getFecha().toLocaleDateString()}\n‣ **Duración**: ${vn.getDuracion() / 60}hrs
        `;

        embed.addFields(
            { name: "▽", value: informacionCampos1, inline: true },
            { name: "▽", value: informacionCampos2, inline: true }
        )

        let informacionCampoIdiomas = "";

        const idiomas = vn.getIdiomas();

        for (let i = 0; i < idiomas.length; i++) {
            let nombreIdioma = ISO6391.getName(idiomas[i]);

            if (nombreIdioma.trim() === '') {
                nombreIdioma = idiomas[i];
            } else {
                nombreIdioma = await traducir(nombreIdioma);
            }

            informacionCampoIdiomas += "`" + nombreIdioma + "` ";
        }

        informacionCampoIdiomas = informacionCampoIdiomas.split(' ').join(' - ').trim();
        informacionCampoIdiomas = informacionCampoIdiomas.substring(0, informacionCampoIdiomas.length - 2);

        if (!informacionCampoIdiomas || informacionCampoIdiomas.length < 0) informacionCampoIdiomas = "`Desconocidos`";

        embed
            .addFields(
                { name: "▿ Idiomas", value: informacionCampoIdiomas, inline: false }
            )

        let informacionCampoPlataformas = "";

        const plataformas = vn.getPlataformas();

        for (let i = 0; i < plataformas.length; i++) {
            informacionCampoPlataformas += "`" + plataformas[i] + "` - "
        }

        informacionCampoPlataformas = informacionCampoPlataformas.substring(0, informacionCampoPlataformas.length - 3);

        if (!informacionCampoPlataformas || informacionCampoPlataformas.length < 0) informacionCampoPlataformas = "`Desconocidos`"

        embed
            .addFields(
                { name: "▿ Plataformas", value: informacionCampoPlataformas, inline: false }
            );
    
        interaccion.editReply({ embeds: [embed] });
    }
}