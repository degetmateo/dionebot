import { EmbedBuilder } from "discord.js";
import Helpers from "../Helpers";

import NovelaVisual from "../media/NovelaVisual";

export default class EmbedNovelaVisual extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(vn: NovelaVisual): EmbedNovelaVisual {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(vn.getDescripcion());

        this.setCampoIdiomas(embed, vn.getIdiomas());
        this.setCampoPlataformas(embed, vn.getPlataformas());

        return embed;
    }

    public static async CrearTraducido(vn: NovelaVisual): Promise<EmbedNovelaVisual> {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(await Helpers.traducir(vn.getDescripcion()));


        this.setCampoIdiomas(embed, await Helpers.traducirElementosArreglo(vn.getIdiomas()));
        this.setCampoPlataformas(embed, vn.getPlataformas());

        return embed;
    }

    private static CrearEmbedBasico(vn: NovelaVisual): EmbedNovelaVisual {
        const embed = new EmbedNovelaVisual()
            .setTitle(vn.getTitulo())
            .setURL(vn.getURL())
            .setThumbnail(vn.getImagenURL())
            .setColor(vn.getColorEstado())
            .setFooter({ text: vn.getAliases().join(' | ') });

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

        return embed;
    }

    private static setCampoIdiomas(embed: EmbedNovelaVisual, idiomas: Array<string>) {
        let informacionCampoIdiomas = "";
    
        for (let i = 0; i < idiomas.length; i++) {    
            informacionCampoIdiomas += "`" + idiomas[i] + "` ";
        }
    
        informacionCampoIdiomas = informacionCampoIdiomas.split(' ').join(' - ').trim();
        informacionCampoIdiomas = informacionCampoIdiomas.substring(0, informacionCampoIdiomas.length - 2);
    
        if (!informacionCampoIdiomas || informacionCampoIdiomas.length < 0) informacionCampoIdiomas = "`Desconocidos`";
    
        embed.addFields({ 
            name: "▿ Idiomas",
            value: informacionCampoIdiomas,
            inline: false
        })
    }

    private static setCampoPlataformas(embed: EmbedNovelaVisual, plataformas: Array<string>) {
        let informacionCampoPlataformas = "";
    
        for (let i = 0; i < plataformas.length; i++) {
            informacionCampoPlataformas += "`" + plataformas[i] + "` - "
        }
    
        informacionCampoPlataformas = informacionCampoPlataformas.substring(0, informacionCampoPlataformas.length - 3);
    
        if (!informacionCampoPlataformas || informacionCampoPlataformas.length < 0) informacionCampoPlataformas = "`Desconocidos`"
    
        embed.addFields({
            name: "▿ Plataformas",
            value: informacionCampoPlataformas,
            inline: false
        })
    }
}