import { ColorResolvable } from "discord.js";
import { getStringSinHTML } from "../helpers";
import ISO6391 from 'iso-639-1';
import { DatosNovelaVisual, EstadoNovelaVisual } from "../tipos/NovelaVisual";

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
        this._descripcion = getStringSinHTML(datos.description);
        this._codigoEstado = datos.devstatus;
        this._estado = this.getEstado();
        this._URL = `https://vndb.org/${this._id}`;
        this._imagenURL = datos.image.url;
        this._aliases = datos.aliases;
        this._fecha = new Date(datos.released);
        this._idiomas = this.getNombresIdiomas(datos.languages);
        this._plataformas = datos.platforms;
        this._duracion = datos.length_minutes;
        this._calificacion = datos.rating;
        this._popularidad = datos.popularity;
    }

    private getNombresIdiomas(idiomas: Array<string>): Array<string> {
        const idiomasTraducidos = new Array<string>();

        for (let i = 0; i < idiomas.length; i++) {
            const nombreIdioma = ISO6391.getName(idiomas[i]);
            
            nombreIdioma.trim() === '' ?
                idiomasTraducidos.push(idiomas[i]) :
                idiomasTraducidos.push(nombreIdioma);
        }

        return idiomasTraducidos;
    }

    public getID(): string {
        return this._id === null ? '?' : this._id;
    }

    public getTitulo(): string {
        return this._titulo === null ? '?' : this._titulo;
    }

    public getDescripcion(): string {
        return this._descripcion;
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