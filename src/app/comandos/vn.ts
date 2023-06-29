import { ChatInputCommandInteraction, Embed, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";
import BOT from "../bot";

import { esNumero } from "../helpers";
import NovelaVisual from "../media/NovelaVisual";
import EmbedNovelaVisual from "../embeds/EmbedNovelaVisual";

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

        const traducir = interaccion.options.getBoolean('traducir') || false;
        
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
        const embed = traducir ?
            await EmbedNovelaVisual.CrearTraducido(vn) :
            EmbedNovelaVisual.Crear(vn);

        interaccion.editReply({ embeds: [embed] });
    }
}