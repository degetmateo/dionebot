import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";
import BOT from "../bot";

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
            
            data: {
                "filters": [tipoCriterio, "=", criterio],
                "fields": "title, image.url"
            }
        };

        const peticionVN = await fetch(apiURL, peticion);
        const respuesta = await peticionVN.json();

        console.log(respuesta);
    }
}

const esNumero = (args: string) => {
    return !(isNaN(+args) || isNaN(parseFloat(args)));
} 