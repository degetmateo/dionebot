import { DatosNovelaVisual } from "./tipos/NovelaVisual";
import { TipoCriterio } from "./tipos/PeticionNovelaVisual";
import NoResultsException from "../../../errors/NoResultsException";

export default class VisualNovelDatabaseAPI {
    private static readonly API_URL: string = 'https://api.vndb.org/kana/vn';
    private static readonly TIPO_CONSULTA = 'POST';
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
        const informacionPeticion = {
            method: this.TIPO_CONSULTA,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ "filters": [tipoCriterio, "=", criterio], "fields": this.CAMPOS_CONSULTAR.join(', ') })
        }

        try {
            const peticion = await fetch(this.API_URL, informacionPeticion);
            return await peticion.json() as RespuestaPeticion;
        } catch (error) {
            throw error;
        }
    }

    public static async obtenerPrimerResultado (tipoCriterio: TipoCriterio, criterio: string): Promise<DatosNovelaVisual | null> {
        const respuesta: RespuestaPeticion = await this.consultarAPI(tipoCriterio, criterio);
        const resultado = respuesta.results[0];
        if (!resultado) throw new NoResultsException('No se han encontrado resultados.');
        return resultado;
    }

    public static async obtenerResultados (criterio: string): Promise<Array<DatosNovelaVisual>> {
        const respuesta: RespuestaPeticion = await this.consultarAPI('search', criterio);
        const resultados = respuesta.results;
        if (resultados.length <= 0) throw new NoResultsException('No se han encontrado resultados.');
        return resultados;
    }
}

type RespuestaPeticion = {
    results: Array<DatosNovelaVisual>
}