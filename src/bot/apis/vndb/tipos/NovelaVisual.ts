export type DatosNovelaVisual = {
    id: string,
    title: string,
    description: string,
    devstatus: number,
    image: { url: string },
    aliases: Array<string>,
    released: Date,
    languages: Array<string>,
    platforms: Array<string>,
    length_minutes: number,
    rating: number,
    popularity: number,
    tags: Array<any>,
}

export type EstadoNovelaVisual = 'FINALIZADA' | 'EN DESARROLLO' | 'CANCELADA' | 'DESCONOCIDO';