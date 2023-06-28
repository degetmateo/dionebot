import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ColorResolvable } from "discord.js";
import fetch from "node-fetch";
import BOT from "../bot";

const translate = require("translate");

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
                "fields": "title, image.url, devstatus, description"
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

        // console.log(resultado);

        const id = resultado.id;
        const vnURL = `https://vndb.org/v${id}`;

        const estados = ['FINALIZADA', 'EN DESARROLLO', 'CANCELADA'];

        const embed = new EmbedBuilder()
            .setTitle(resultado.title)
            .setURL(vnURL)
            .setDescription(traducirSinopsis ?  await traducir(resultado.description) : resultado.description)
            .setThumbnail(resultado.image.url)
            .setColor(getColorEstado(estados[resultado.devstatus]));
    

        const informacionCampos1 = `
            ‣ **Estado**: ${estados[resultado.devstatus]}
        `;

        embed.addFields({ name: "▽", value: informacionCampos1, inline: true })
    
        interaccion.editReply({ embeds: [embed] });
    }
}

const esNumero = (args: string) => {
    return !(isNaN(+args) || isNaN(parseFloat(args)));
}

const traducir = async (args: string) => {
    return await translate(args, "es");
}

const getColorEstado = (estado: string): ColorResolvable => {
    let hex = "";

    switch (estado) {
        case "FINALIZADA": hex = "00D907"; break;
        case "EN DESARROLLO": hex = "FFF700"; break;
        case "CANCELADA": hex = "FF0000"; break;
        default: hex = "000000"; break;
    }

    return ("#" + hex) as ColorResolvable;
}