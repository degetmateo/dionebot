import { ColorResolvable, EmbedBuilder } from "discord.js";
import Helpers from "../helpers";
import Anianime from "../apis/anilist/models/anianime";

export default class AnimeEmbed extends EmbedBuilder {
    constructor (anime: Anianime) {
        super();

        let description = anime.getDescription();

        if (description) {
            if (description.length > 4096) {
                description = description.slice(0, 4090) + '...';
            };
        };

        this.setColor(anime.getColorAsResolvable());
        this.setThumbnail(anime.getCoverImageUrl());
        this.setTitle(anime.getTitle());
        this.setURL(anime.getSiteUrl());
        if (description) this.setDescription(description);
        this.setImage(anime.getBannerImageUrl());

        if (anime.getSynonyms().length > 0) {
            this.setFooter({ text: anime.getSynonyms().join(' | ') });
        };

        const field_a_text = 
            `‣ **ID**: \`${anime.getId()}\`\n` +
            `‣ **Fuente**: \`${anime.getSource() || 'IDK'}\`\n` +
            `‣ **Formato**: \`${anime.getFormat() || 'IDK'}\`\n` + 
            `‣ **Estado**: \`${anime.getStatus() || 'IDK'}\`\n` +
            `‣ **Emisión**: \`${anime.getStartDate() || 'IDK'}\``
        ;

        const field_b_text = 
            `‣ **Temporada**: \`${anime.getSeason() || 'IDK'}\`\n`+
            `‣ **Episodios**: \`${anime.getEpisodes() || 'IDK'}\`\n`+
            `‣ **Calificación**: \`${anime.getMeanScore() ? anime.getMeanScore() + '/100' : 'IDK'}\`\n`+
            `‣ **Popularidad**: \`${anime.getPopularity() || 'IDK'}\`\n`+
            `‣ **Favoritos**: \`${anime.getFavourites() || 'IDK'}\``
        ;

        this.addFields(
            { name: "▾", value: field_a_text, inline: true },
            { name: "▾", value: field_b_text, inline: true }
        );

        const genres = anime.getGenres().length >= 1 ?
            '`' + anime.getGenres().join('` - `') + '`' : 
            '`Desconocidos`'
        ;
        
        const studios = anime.getStudios().length >= 1 ?
            '`' + anime.getStudios().join('` - `') + '`' : 
            '`Desconocidos`'
        ;

        const tags = anime.getNoSpoilerTags().length >= 1 ?
            '`' + anime.getNoSpoilerTags().join('` - `') + '`' : 
            '`Desconocidas`'
        ;

        this.addFields(
            { name: "▾ Géneros", value: genres, inline: false },
            { name: "▾ Estudios", value: studios, inline: false },
            { name: "▾ Etiquetas", value: tags, inline: false }
        );
    };
};