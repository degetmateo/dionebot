import { DatosNovelaVisual } from "../tipos/NovelaVisual";
import { PeticionAPI } from "../tipos/PeticionAPI";
import { TipoCriterio } from "../tipos/PeticionNovelaVisual";

export default class VisualNovelDatabaseAPI {
    private static API_URL: string = 'https://api.vndb.org/kana/vn';
    
    private static async FetchAPI(tipoCriterio: TipoCriterio, criterio: string): Promise<any> {
        const peticion: PeticionAPI = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            
            body: JSON.stringify({ 
                "filters": [tipoCriterio, "=", criterio],
                "fields": "title, image.url, devstatus, description, aliases, released, languages, platforms, length_minutes, rating, popularity"
            })
        }

        const peticionVN = await fetch(this.API_URL, peticion);
        return await peticionVN.json();
    }

    public static async FetchNovelaVisual(tipoCriterio: TipoCriterio, criterio: string): Promise<DatosNovelaVisual | null> {
        const resultado: any = await this.FetchAPI(tipoCriterio, criterio);
        return resultado.results[0];
    }

    public static async FetchNovelasVisuales(criterio: string): Promise<Array<DatosNovelaVisual>> {
        const resultado: any = await this.FetchAPI('search', criterio);
        return resultado.results;
    }
}