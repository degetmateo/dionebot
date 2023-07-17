export type ResultadosMedia = Array<Media>;

export type Media = {
    id: number,
    idMal: number,
    title: MediaTitulo,
    type: MediaTipo,
    format: MediaFormato,
    status: MediaEstado,
    description: string,
    startDate: MediaFecha,
    endDate: MediaFecha,
    season: MediaTemporada,
    episodes: number,
    duration: number,
    chapters: number,
    volumes: number,
    source: MediaOrigen,
    trailer: MediaTrailer,
    updatedAt: number,
    coverImage: MediaImagenPortada,
    bannerImage: string,
    genres: MediaGeneros,
    synonyms: MediaSinonimos,
    averageScore: number,
    meanScore: number,
    popularity: number,
    favourites: number,
    studios: MediaEstudios,
    siteUrl: string
}

export type MediaTipo = 'ANIME' | 'MANGA';

export type MediaTitulo = {
    romaji: string,
    english: string,
    native: string,
    userPreferred: string
}

export type MediaFormato = 
    'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT';

export type MediaEstado = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export type MediaFecha = {
    year: number,
    month: number,
    day: number
}

export type MediaTemporada = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export type MediaOrigen = 
'ORIGINAL' | 'MANGA' | 'LIGHT_NOVEL' | 'VISUAL_NOVEL' | 'VIDEO_GAME' | 'OTHER' | 'NOVEL' | 'DOUJINSHI' | 'ANIME' | 'WEB_NOVEL' | 'LIVE_ACTION' | 'GAME' | 'COMIC' | 'MULTIMEDIA_PROJECT' | 'PICTURE_BOOK';

export type MediaTrailer = {
    id: string,
    site: string,
    thumbnail: string
}

export type MediaImagenPortada = {
    small: string;
    extraLarge: string,
    large: string,
    medium: string,
    color: string
}

export type MediaGeneros = Array<string>;

export type MediaSinonimos = Array<string>;

export type MediaEstudios = {
    edges: MediaListaEstudios
}

export type MediaListaEstudios = Array<{ node: MediaEstudio }>;

export type MediaEstudio = {
    id: number,
    name: string
}

export type MediaColeccion = {
    user: { id: number, name: string },
    lists: Array<{ status: MediaEstado, entries: Array<{ mediaId: number, score: number }> }>,
}

