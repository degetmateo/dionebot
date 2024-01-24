import { EmbedBuilder } from "discord.js";
import Helpers from "../Helpers";
import NovelaVisual from "../apis/vndb/modelos/VisualNovel";

export default class EmbedVisualNovel extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Create (vn: NovelaVisual): EmbedVisualNovel {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(vn.getDescription());

        this.setCampoIdiomas(embed, vn.getLanguages());
        this.setCampoPlataformas(embed, vn.getPlatforms());

        return embed;
    }

    public static async CreateTranslated (vn: NovelaVisual): Promise<EmbedVisualNovel> {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(await Helpers.traducir(vn.getDescription()));


        this.setCampoIdiomas(embed, await Helpers.traducirElementosArreglo(vn.getLanguages()));
        this.setCampoPlataformas(embed, vn.getPlatforms());

        return embed;
    }

    private static CrearEmbedBasico(vn: NovelaVisual): EmbedVisualNovel {
        const embed = new EmbedVisualNovel()
            .setTitle(vn.getTitle())
            .setURL(vn.getUrl())
            .setThumbnail(vn.getCoverUrl())
            .setFooter({ text: vn.getAliases().join(' | ') });

        const calificationText = vn.getCalification() ?
            `${vn.getCalification().toFixed(0)}/100` :
            'Desconocida';

        const popularityText = vn.getPopularity() ?
            `${vn.getPopularity().toFixed(2)}` :
            'Desconocida';

        const informacionCampos1 = `
            ‣ **Estado**: ${vn.getStatus()}\n‣ **Calificación**: ${calificationText}\n‣ **Popularidad**: ${popularityText}
        `;

        const dateText = vn.getDate() ?
            `${vn.getDate().toLocaleDateString()}` :
            'Desconocida';

        const durationText = vn.getDuration() ?
            `${(vn.getDuration() / 60).toFixed(2)}hrs` :
            'Desconocida';

        const informacionCampos2 = `
            ‣ **Fecha de Salida**: ${dateText}\n‣ **Duración**: ${durationText}
        `;

        embed.addFields(
            { name: "▾", value: informacionCampos1, inline: true },
            { name: "▾", value: informacionCampos2, inline: true }
        )

        return embed;
    }

    private static setCampoIdiomas(embed: EmbedVisualNovel, idiomas: Array<string>) {
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

    private static setCampoPlataformas(embed: EmbedVisualNovel, plataformas: Array<string>) {
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