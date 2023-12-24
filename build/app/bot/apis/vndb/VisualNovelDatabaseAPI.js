"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
class VisualNovelDatabaseAPI {
    static async consultarAPI(tipoCriterio, criterio) {
        const informacionPeticion = {
            method: this.TIPO_CONSULTA,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ "filters": [tipoCriterio, "=", criterio], "fields": this.CAMPOS_CONSULTAR.join(', ') })
        };
        try {
            const peticion = await fetch(this.API_URL, informacionPeticion);
            return await peticion.json();
        }
        catch (error) {
            throw error;
        }
    }
    static async obtenerPrimerResultado(tipoCriterio, criterio) {
        const respuesta = await this.consultarAPI(tipoCriterio, criterio);
        const resultado = respuesta.results[0];
        if (!resultado)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        return resultado;
    }
    static async obtenerResultados(criterio) {
        const respuesta = await this.consultarAPI('search', criterio);
        const resultados = respuesta.results;
        if (resultados.length <= 0)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        return resultados;
    }
}
exports.default = VisualNovelDatabaseAPI;
VisualNovelDatabaseAPI.API_URL = 'https://api.vndb.org/kana/vn';
VisualNovelDatabaseAPI.TIPO_CONSULTA = 'POST';
VisualNovelDatabaseAPI.CAMPOS_CONSULTAR = [
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
