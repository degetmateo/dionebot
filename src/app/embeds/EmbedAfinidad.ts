import { EmbedBuilder } from "discord.js";
import Anime from "../media/Anime";

export default class EmbedAfinidad extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(afinidades: Array<{ name: string, afinidad: number }>): EmbedAfinidad {
        const embed = new EmbedAfinidad();

        const informacion: string = afinidades.map((a) => `▸ ${a.name}: **${a.afinidad}%**`).join('\n');
        embed.setDescription(informacion.length > 0 ? informacion : '?');


        return embed;
    }
}