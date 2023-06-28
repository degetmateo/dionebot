import { ColorResolvable } from "discord.js";
import { traducir } from "../helpers";

export default class NovelaVisual {
    private _id: string;
    private _titulo: string;
    private _descripcion: string;
    private _codigoEstado: number;
    private _estado: EstadoNovelaVisual;
    private _URL: string;
    private _imagenURL: string;
    private _aliases: Array<string>;
    private _fecha: Date;
    private _idiomas: Array<string>;
    private _plataformas: Array<string>;
    private _duracion: number;
    private _calificacion: number;
    private _popularidad: number;

    constructor (datos: DatosNovelaVisual) {
        this._id = datos.id;
        this._titulo = datos.title;
        this._descripcion = datos.description;
        this._codigoEstado = datos.devstatus;
        this._estado = this.getEstado();
        this._URL = `https://vndb.org/${this._id}`;
        this._imagenURL = datos.image.url;
        this._aliases = datos.aliases;
        this._fecha = new Date(datos.released);
        this._idiomas = datos.languages;
        this._plataformas = datos.platforms;
        this._duracion = datos.length_minutes;
        this._calificacion = datos.rating;
        this._popularidad = datos.popularity;
    }

    public getID(): string {
        return this._id === null ? '?' : this._id;
    }

    public getTitulo(): string {
        return this._titulo === null ? '?' : this._titulo;
    }

    public getDescripcion(): string {
        const descripcion: string = this._descripcion == null ? "?" : this._descripcion.trim()
            .split("<br>").join("")
            .split("</br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("")
            .split("&ldquo;").join("*")
            .split("&rdquo;").join("*")
            .split("&rsquo;").join("'");

        return descripcion.length <= 0 ? "?" : descripcion;
    }

    public async getDescripcionTraducida(): Promise<string> {
        return await traducir(this.getDescripcion());
    }

    public getEstado(): EstadoNovelaVisual {
        switch (this._codigoEstado) {
            case 0: return 'FINALIZADA';
            case 1: return 'EN DESARROLLO';
            case 2: return 'CANCELADA';
            default: return 'DESCONOCIDO';
        }
    }

    public getColorEstado(): ColorResolvable {
        let hex = "";

        switch (this._estado) {
            case 'FINALIZADA': hex = "00D907"; break;
            case 'EN DESARROLLO': hex = "FFF700"; break;
            case 'CANCELADA': hex = "FF0000"; break;
            case 'DESCONOCIDO': hex = "000000"; break;
            default: hex = "000000"; break;
        }
    
        return ('#' + hex) as ColorResolvable;
    }

    public getURL(): string {
        return this._URL;
    }

    public getImagenURL(): string {
        return this._imagenURL === null ? '?' : this._imagenURL;
    }

    public getAliases(): Array<string> {
        return this._aliases;
    }

    public getFecha(): Date {
        return this._fecha;
    }

    public getIdiomas(): Array<string> {
        return this._idiomas;
    }

    public getPlataformas(): Array<string> {
        return this._plataformas;
    }

    public getDuracion(): number {
        return this._duracion;
    }

    public getCalificacion(): number {
        return this._calificacion;
    }

    public getPopularidad(): number {
        return this._popularidad;
    }
}

type DatosNovelaVisual = {
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

type EstadoNovelaVisual = 'FINALIZADA' | 'EN DESARROLLO' | 'CANCELADA' | 'DESCONOCIDO';