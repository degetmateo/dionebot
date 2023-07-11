import API from "./API";

import { DatosNovelaVisual } from "../tipos/NovelaVisual";
import { PeticionAPI, TipoConsulta } from "../tipos/PeticionAPI";
import { TipoCriterio } from "../tipos/PeticionNovelaVisual";

export default class VisualNovelDatabaseAPI extends API {
    private static readonly API_URL: string = 'https://api.vndb.org/kana/vn';
    private static readonly TIPO_CONSULTA: TipoConsulta = 'POST';
    private static readonly CAMPOS_CONSULTAR: Array<string> = [
        'title',
        'image.url',
        'devstatus',
        'description',
        'aliases',
        'released',
        'languages',
        'platforms',
        'length_minutes',
        'rating',
        'popularity'
    ];
    
    private static async consultarAPI (tipoCriterio: TipoCriterio, criterio: string): Promise<RespuestaPeticion> {
        const informacionPeticion: PeticionAPI = {
            method: this.TIPO_CONSULTA,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ "filters": [tipoCriterio, "=", criterio], "fields": this.CAMPOS_CONSULTAR.join(', ') })
        }

        const peticion = await fetch(this.API_URL, informacionPeticion);
        return await peticion.json() as RespuestaPeticion;
    }

    public static async obtenerPrimerResultado (tipoCriterio: TipoCriterio, criterio: string): Promise<DatosNovelaVisual | null> {
        const resultado: RespuestaPeticion = await this.consultarAPI(tipoCriterio, criterio);
        return resultado.results[0];
    }

    public static async obtenerResultados (criterio: string): Promise<Array<DatosNovelaVisual>> {
        const resultado: RespuestaPeticion = await this.consultarAPI('search', criterio);
        return resultado.results;
    }
}

type RespuestaPeticion = {
    results: Array<DatosNovelaVisual>
}