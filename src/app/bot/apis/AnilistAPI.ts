import fetch from 'node-fetch';
import { MediaList } from './anilist/types/MediaList';
import { PeticionAPI } from './types/PeticionAPI';
import { uRegistrado } from '../types';
import {Media, MediaColeccion, MediaTemporada, ResultadosMedia } from './anilist/types/Media';
import { Usuario } from './anilist/types/Usuario';
import UsuarioAnilist from './anilist/modelos/UsuarioAnilist';
import BuscadorMedia from './anilist/modulos/BuscadorMedia';
import BuscadorAnimesTemporada from './anilist/modulos/BuscadorMediaTemporada';
import BuscadorUsuario from './anilist/modulos/BuscadorUsuario';
import BuscadorEstadoMediaUsuarios from './anilist/modulos/BuscadorEstadoMediaUsuarios';
import BuscadorListasCompletasUsuarios from './anilist/modulos/BuscadorListasCompletasUsuarios';
import ErrorDemasiadasPeticiones from '../../errores/ErrorDemasiadasPeticiones';
import ErrorSinResultados from '../../errores/ErrorSinResultados';

export default class AnilistAPI {
    private static readonly API_URL: string = "https://graphql.anilist.co";
    public static readonly RESULTADOS_PAGINA: number = 10;
    public static readonly CANTIDAD_CONSULTAS_POR_PETICION: number = 10;

    private static readonly URL_AUTORIZACION: string = 'https://anilist.co/api/v2/oauth/token';


    public static async buscarAnimePorID (id: number): Promise<Media> {
        return await BuscadorMedia.BuscarMediaPorID(id, 'ANIME');
    }

    public static async buscarMangaPorID (id: number): Promise<Media> {
        return await BuscadorMedia.BuscarMediaPorID(id, 'MANGA');
    }

    public static async buscarAnimePorNombre (criterio: string): Promise<ResultadosMedia> {
        return await BuscadorMedia.BuscarMediaPorNombre(criterio, 'ANIME');
    }

    public static async buscarMangaPorNombre (criterio: string): Promise<ResultadosMedia> {
        return await BuscadorMedia.BuscarMediaPorNombre(criterio, 'MANGA');
    }

    public static async buscarAnimesTemporada (anio: number, temporada: MediaTemporada): Promise<ResultadosMedia> {
        return await BuscadorAnimesTemporada.buscarAnimesTemporada(anio, temporada);
    }

    public static async buscarUsuario (criterio: number | string): Promise<Usuario> {
        return await BuscadorUsuario.BuscarUsuario(criterio);
    }

    public static async buscarEstadoMediaUsuarios (usuarios: Array<uRegistrado>, mediaID: number):  Promise<Array<MediaList>> {
        return await BuscadorEstadoMediaUsuarios.BuscarEstadoMediaUsuarios(usuarios, mediaID);
    }

    public static async buscarListasCompletadosUsuarios (usuario: UsuarioAnilist, usuarios: Array<uRegistrado>) {
        const mediaUsuario: MediaColeccion = await BuscadorListasCompletasUsuarios.BuscarListaCompletadosUsuario(usuario.obtenerID());
        const mediaUsuarios: Array<MediaColeccion> = await BuscadorListasCompletasUsuarios.BuscarListasCompletadosUsuarios(usuarios);
        return { user: mediaUsuario, users: mediaUsuarios };
    }

    public static async peticion (query: string, variables: any): Promise<any | null> {
        const opciones: PeticionAPI = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query, variables })
        }
        
        const data = await fetch(this.API_URL, opciones);
        if (!data) throw new ErrorSinResultados('No se han encontrado resultados.');

        const res = await data.json();
        
        if (res.errors) {
            const e = res.errors[0];
            const message = e.message.toLowerCase();

            if (message.includes('not found')) {
                throw new ErrorSinResultados('QUERY: No se han encontrado resultados.');
            }

            if (message.includes('max query complexity')) {
                console.error(e);
                throw new ErrorDemasiadasPeticiones('Se han realizado demasiadas peticiones al servidor. Intentalo de nuevo mas tarde.');
            }

            throw new Error(message);
        }

        if (!res || !res.data) throw new ErrorSinResultados('No se han encontrado resultados.');
        return res.data;
    }

    public static async obtenerTokenDeAcceso (codigo: string) {
        const opciones: PeticionAPI = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
          body: JSON.stringify({
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENTE_ANILIST_ID,
            'client_secret': process.env.CLIENTE_ANILIST_TOKEN,
            'redirect_uri': process.env.URL_REDIRECCION,
            'code': codigo,
          })
        };
        
        fetch(this.URL_AUTORIZACION, opciones)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }
}