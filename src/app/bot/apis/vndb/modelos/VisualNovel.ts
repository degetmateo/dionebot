import { ColorResolvable } from "discord.js";
import Helpers from "../../../Helpers";
import ISO6391 from 'iso-639-1';
import { DatosNovelaVisual, EstadoNovelaVisual } from "../tipos/NovelaVisual";

export default class VisualNovel {
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
        this._descripcion = Helpers.eliminarEtiquetasHTML(datos.description);
        this._codigoEstado = datos.devstatus;
        this._estado = this.getStatus();
        this._URL = `https://vndb.org/${this._id}`;
        this._imagenURL = datos.image.url;
        this._aliases = datos.aliases;
        this._fecha = new Date(datos.released);
        this._idiomas = this.getLanguagesNames(datos.languages);
        this._plataformas = datos.platforms;
        this._duracion = datos.length_minutes;
        this._calificacion = datos.rating;
        this._popularidad = datos.popularity;
    }

    private getLanguagesNames (idiomas: Array<string>): Array<string> {
        const idiomasTraducidos = new Array<string>();

        for (let i = 0; i < idiomas.length; i++) {
            const nombreIdioma = ISO6391.getName(idiomas[i]);
            
            nombreIdioma.trim() === '' ?
                idiomasTraducidos.push(idiomas[i]) :
                idiomasTraducidos.push(nombreIdioma);
        }

        return idiomasTraducidos;
    }

    public getId (): string {
        return this._id === null ? '?' : this._id;
    }

    public getTitle (): string {
        return this._titulo === null ? '?' : this._titulo;
    }

    public getDescription (): string {
        return this.esDescripcionNula() ?
            'Descripcion Desconocida' : this._descripcion;
    }

    private esDescripcionNula (): boolean {
        const d = this._descripcion;
        return (d.length <= 1 || d === null);
    }

    public getStatus (): EstadoNovelaVisual {
        switch (this._codigoEstado) {
            case 0: return 'FINALIZADA';
            case 1: return 'EN DESARROLLO';
            case 2: return 'CANCELADA';
            default: return 'DESCONOCIDO';
        }
    }

    public getStatusColor (): ColorResolvable {
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

    public getUrl (): string {
        return this._URL;
    }

    public getCoverUrl(): string {
        return this._imagenURL;
    }

    public getAliases (): Array<string> {
        return this._aliases;
    }

    public getDate (): Date {
        return this._fecha;
    }

    public getLanguages (): Array<string> {
        return this._idiomas;
    }

    public getPlatforms (): Array<string> {
        return this._plataformas;
    }

    public getDuration (): number {
        return this._duracion;
    }

    public getCalification (): number {
        return this._calificacion;
    }

    public getPopularity (): number {
        return this._popularidad;
    }
}