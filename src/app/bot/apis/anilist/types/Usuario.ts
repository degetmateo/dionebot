import { MediaTitulo } from "./Media";

export type Usuario = {
    id: number,
    name: string,
    about: string,
    avatar: UsuarioAvatar,
    bannerImage: string,
    options: UsuarioOpciones,
    statistics: UsuarioEstadisticas,
    siteUrl: string,
    createdAt: number,
}

export type UsuarioAvatar = {
    large: string,
    medium: string
}

export type UsuarioOpciones = {
    profileColor: string,
}

export type TituloIdioma = 'ROMAJI' | 'ENGLISH' | 'NATIVE' | 'ROMAJI_STYLISED' | 'ENGLISH_STYLISED' | 'NATIVE_STYLISED';

export type UsuarioOpcionesMedia = {
    scoreFormat: FormatoNota,
}

export type FormatoNota = 'POINT_100' | 'POINT_10_DECIMAL' | 'POINT_10' | 'POINT_5' | 'POINT_3';

export type UsuarioFavoritos = {
    anime: UsuarioMediaRelation,
    manga: UsuarioMediaRelation,
    characters: UsuarioCharRelation,
}

export type UsuarioMediaRelation = { edges: UsuarioMediaFavLista };
export type UsuarioCharRelation = { edges: UsuarioCharFavLista };

export type UsuarioMediaFavLista = Array<{ node: { id: number, title: MediaTitulo } }>;
export type UsuarioCharFavLista = Array<{ node: { id: number, name: PersonajeNombre } }>;

export type PersonajeNombre = {
    first: string,
    middle: string,
    last: string,
    full: string,
    native: string,
    userPreferred: string
}

export type UsuarioEstadisticas = {
    anime: UsuarioEstadisticasAnime,
    manga: UsuarioEstadisticasManga
}

export type UsuarioEstadisticasAnime = {
    count: number,
    meanScore: number,
    standardDeviation: number,
    minutesWatched: number,
    episodesWatched: number,
    genres: UsuarioGenerosFavoritosLista,
}

export type UsuarioEstadisticasManga = {
    count: number,
    meanScore: number,
    standardDeviation: number,
    chaptersRead: number,
    volumesRead: number,
    genres: UsuarioGenerosFavoritosLista,
}

export type UsuarioGenerosFavoritosLista = Array<Genero>;
export type Genero = { genre: string, count: number };