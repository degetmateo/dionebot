import { ActionRowData, APIMessageTopLevelComponent, codeBlock, ContainerBuilder, JSONEncodable, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageActionRowComponentBuilder, MessageActionRowComponentData, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder, TopLevelComponentData } from "discord.js";
import Helpers from "../helpers";
import Anianime from "../apis/anilist/models/anianime";

export const AnimeComponent = (anime: Anianime): (
    | JSONEncodable<APIMessageTopLevelComponent>
    | TopLevelComponentData
    | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
    | APIMessageTopLevelComponent
) => {
    const comp = new ContainerBuilder()
        .setAccentColor(anime.getColorAsRGBTuple())
    ;

    comp.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `## [${anime.getTitle()}](${anime.getSiteUrl()})`
                )
        )
    ;

    comp
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`${anime.getDescription()}`)
        )
    ;

    const genres = 
        anime.getGenres().length >= 1 ?
            '`' + anime.getGenres().join('` - `') + '`':
            '`Desconocidos`'
    ;

    const studios = 
        anime.getStudios().length >= 1 ?
            '`' + anime.getStudios().join('` - `') + '`':
            '`Desconocidos`'
    ;

    const TAGS = 
        anime.getNoSpoilerTags().length >= 1 ?
            '`' + anime.getNoSpoilerTags().join('` - `') + '`': 
            '`Desconocidas`'
    ;

    const metaSection = new SectionBuilder();

    metaSection
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `### Ficha Técnica\n`+
                    `ID: \`${anime.getId()}\` - ` +
                    `Formato: \`${anime.getFormat() || 'Desconocido'}\` - ` +
                    `Fuente: \`${anime.getSource() || 'Desconocida'}\` - ` +
                    `Estado: \`${anime.getStatus() || 'Desconocido'}\` - ` +
                    `Temporada: \`${anime.getSeason() || 'Desconocida'}\` - ` +
                    `Emisión: \`${anime.getStartDate() || 'Desconocida'}\` - ` +
                    `Episodios: \`${anime.getEpisodes() || 'Desconocidos'}\` - ` +
                    `Calificación: \`${anime.getMeanScore()}/100\` - ` +
                    `Popularidad: \`${anime.getPopularity() || 'Desconocida'}\` - ` +
                    `Favoritos: \`${anime.getFavourites() || 'Desconocidos'}\``
                )
        )
    ;

    if (anime.getCoverImageUrl()) {
        metaSection
            .setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL(anime.getCoverImageUrl())
            )
        ;
    };

    comp.addSectionComponents(metaSection);

    comp
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `### Géneros\n`+
                    `${genres}`
                ),
            new TextDisplayBuilder()
                .setContent(
                    `### Estudios\n` +
                    `${studios}`
                ),
            new TextDisplayBuilder()
                .setContent(
                    '### Etiquetas\n' +
                    `${TAGS}`
                )
        )
    ;

    if (anime.getBannerImageUrl()) {
        comp.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(anime.getBannerImageUrl())
                )
        );
    };

    if (anime.getSynonyms()) {
        comp
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`-# ${anime.getSynonyms().join(' | ')}`)
            )
        ;
    };

    return comp;
};