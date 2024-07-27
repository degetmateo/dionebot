import { Embed, EmbedBuilder } from "discord.js";
import Media from "../apis/anilist/modelos/media/Media";
import Helpers from "../Helpers";

export default abstract class EmbedMedia extends EmbedBuilder {
    protected media: Media;

    protected CreateBasic (): EmbedMedia {
        return this
            .setTitle(this.media.getTitles().userPreferred)
            .setURL(this.media.getURL())
            .setThumbnail(this.media.getCoverURL())
            .setImage(this.media.getBannerURL())
            .setColor(this.media.getColor())
            .setTitles();
    }

    protected setTitles (): EmbedMedia {
        const titles = this.media.getTitles();
        
        let listTitles = [];
        if (titles.romaji) listTitles.push(titles.romaji);
        if (titles.english) listTitles.push(titles.english);
        if (titles.native) listTitles.push(titles.native);        
        listTitles = Helpers.eliminarElementosRepetidos(listTitles);

        return this.setFooter({ text: listTitles.join(' | ') });
    }
}