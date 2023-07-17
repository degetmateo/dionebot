import { ChatInputCommandInteraction, CacheType, User, Embed, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";
import { Usuario } from "../../apis/anilist/types/Usuario";
import UsuarioAnilist from "../../apis/anilist/modelos/UsuarioAnilist";
import { uRegistrado } from "../../types";
import Boton from "../componentes/Boton";
import { Afinidad, MediaCompartida } from "../types/Afinidad";
import Bot from "../../Bot";
import Helpers from "../../../Helpers";
import ErrorArgumentoInvalido from "../../../errores/ErrorArgumentoInvalido";
import ErrorSinResultados from "../../../errores/ErrorSinResultados";

export default class InteraccionComandoAfinidad extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private bot: Bot;
    private serverID: string;
    private usuario: User | null;

    private embeds: Array<EmbedBuilder>;

    private indiceInteraccion: number;
    private ultimoIndiceInteraccion: number;

    private botonPaginaPrevia = Boton.CrearPrevio();
    private botonPaginaSiguiente = Boton.CrearSiguiente();

    private row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;

        this.bot = interaction.client as Bot;

        this.serverID = interaction.guild?.id as string;
        this.usuario = this.interaction.options.getUser("usuario");

        this.embeds = new Array<EmbedBuilder>();

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = 0;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoAfinidad(interaction);
        await modulo.execute();
    }

    protected async execute (): Promise<void> {
        await this.interaction.deferReply();

        const usuarioID = (!this.usuario) ? this.interaction.user.id : this.usuario.id;
        
        let usuariosRegistrados = this.bot.getUsuariosRegistrados(this.serverID);
        usuariosRegistrados = Helpers.eliminarElementosRepetidos(usuariosRegistrados);
        
        const usuarioRegistrado = usuariosRegistrados.find(u => u.discordId === usuarioID);

        if (!usuarioRegistrado) throw new ErrorArgumentoInvalido('Tu o el usuario especificado no estan registrados.');

        let busquedaUsuario: Usuario;

        try {
            busquedaUsuario = await AnilistAPI.buscarUsuario(usuarioRegistrado.anilistUsername);   
        } catch (error) {
            if (error instanceof ErrorSinResultados) {
                throw new ErrorSinResultados(`No se ha encontrado al usuario **${usuarioRegistrado.anilistUsername}** en anilist. Puede que se haya cambiado el nombre.`);
            }

            throw error;
        }

        const usuario = new UsuarioAnilist(busquedaUsuario);
        let afinidades = await this.obtenerAfinidadesUsuario(usuario, usuariosRegistrados);
        afinidades = Helpers.eliminarElementosRepetidos(afinidades);

        if (!afinidades || afinidades.length <= 0) throw new ErrorSinResultados('No hay afinidades disponibles.');

        this.embeds = InteraccionComandoAfinidad.obtenerEmbeds(usuario, afinidades);

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = this.embeds.length - 1;

        const embed = this.embeds[this.indiceInteraccion];

        const respuesta = await this.interaction.editReply({
            embeds: [embed],
            components: [this.row]
        })

        try {
            const collector = respuesta.createMessageComponentCollector({
                time: InteraccionComando.TIEMPO_ESPERA_INTERACCION
            });
            
            collector.on('collect', async (boton: ButtonInteraction) => {
                await boton.deferUpdate();

                if (boton.customId === Boton.BotonPrevioID) {
                    this.indiceInteraccion--;
                    if (this.indiceInteraccion < 0) this.indiceInteraccion = this.ultimoIndiceInteraccion;  
                }

                if (boton.customId === Boton.BotonSiguienteID) {
                    this.indiceInteraccion++;
                    if (this.indiceInteraccion > this.ultimoIndiceInteraccion) this.indiceInteraccion = 0;
                }

                await this.actualizarInteraccion(boton);
            })
        } catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }

    private async actualizarInteraccion (boton: ButtonInteraction) {
        try {
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] }); 
        } catch (error) {            
            console.error(error);
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [] });
        }
    }

    private static obtenerEmbeds (usuario: UsuarioAnilist, afinidades: Array<Afinidad>): Array<EmbedBuilder> {
        const embeds = Array<EmbedBuilder>();
        const numEmbeds = (afinidades.length / 10) + 1;

        for (let i = 0; i < numEmbeds; i++) {
            let parteActual = afinidades.slice(i * 10, (i * 10) + 10);
            let parteActualChequeada = new Array<{ nombre: string, afinidad: number }>();

            for (const p of parteActual) {
                if (p) parteActualChequeada.push(p);
            }

            if (parteActualChequeada.length <= 0) continue;

            const embed = new EmbedBuilder();
            const informacion: string = parteActualChequeada.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.afinidad}%]** ▸ ${a.nombre}`).join('\n');
            
            embed.setDescription(informacion);

            const avatar = usuario.obtenerAvatarURL();

            avatar ? 
                embed.setThumbnail(avatar) : null;

            embed.setColor(usuario.obtenerColor());
            embed.setTitle('Afinidad de ' + usuario.obtenerNombre());

            embed.setFooter({ text: `Pagina ${i + 1} de ${(numEmbeds - 1).toFixed(0)}` });

            embeds.push(embed);
        }

        return embeds;
    }
    
    private async obtenerAfinidadesUsuario (usuario: UsuarioAnilist, usuarios: Array<uRegistrado>) {
        const datos = await AnilistAPI.buscarListasCompletadosUsuarios(usuario, usuarios);

        const mediaColeccionUsuario = datos.user;
        const mediaColeccionUsuarios = Helpers.eliminarElementosRepetidos(datos.users);

        const listaMediaUsuario = mediaColeccionUsuario.lists[0];

        if (!listaMediaUsuario) throw new Error('Ha ocurrido un error inesperado.');

        const mediaCompletadaUsuario = listaMediaUsuario.entries;
        
        const afinidades: Array<Afinidad> = [];

        for (const u of usuarios) {
            if (u.anilistUsername == usuario.obtenerNombre() || !u.anilistUsername || !u.anilistId) {
                continue;
            }

            const listaMediaUsuario2 = mediaColeccionUsuarios.find(m => m.user.id === parseInt(u.anilistId))?.lists[0]; 
            if (!listaMediaUsuario2) continue;
            const mediaCompletadaUsuario2 = listaMediaUsuario2.entries;

            const resultado = await InteraccionComandoAfinidad.HandleAffinity(mediaCompletadaUsuario, mediaCompletadaUsuario2);

            const usuarioDiscord = await this.bot.users.fetch(u.discordId);

            if (!usuarioDiscord) continue;

            const nombre = usuarioDiscord.username;
            
            if (nombre.includes('Deleted User')) continue;
            
            afinidades.push({ nombre: nombre, afinidad: parseFloat(resultado.toFixed(2)) });
        }

        return InteraccionComandoAfinidad.OrdenarAfinidades(Helpers.eliminarElementosRepetidos(afinidades));
    }

    private static async HandleAffinity (animes1: Array<{ mediaId: number, score: number }>, animes2: Array<{ mediaId: number, score: number }>) {
        const mediaCompartida = InteraccionComandoAfinidad.ObtenerMediaCompartida(animes1, animes2);
        return this.CalcularAfinidad(Helpers.eliminarElementosRepetidos(mediaCompartida));
    }

    private static ObtenerMediaCompartida(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
        const mediaCompartida = new Array<MediaCompartida>();

        for (const media of l1) {
            const media2 = l2.find(m => m.mediaId === media.mediaId);
            if (!media2) continue;
            mediaCompartida.push({ id: media.mediaId, scoreA: media.score, scoreB: media2.score });
        }

        return mediaCompartida;
    }

    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */

    private static CalcularAfinidad(mediaCompartida: Array<MediaCompartida>): number {
        const scoresA: Array<number> = mediaCompartida.map(media => media.scoreA);
        const scoresB: Array<number> = mediaCompartida.map(media => media.scoreB);

        const ma = this.CalcularPromedioLista(scoresA);
        const mb = this.CalcularPromedioLista(scoresB);

        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);

        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));

        const numerador = this.SumarLista(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominador = Math.sqrt(this.SumarLista(sa) * this.SumarLista(sb));

        return (numerador <= 0 || denominador <= 0 ? 0 : numerador / denominador) * 100;
    }

    private static zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);

    private static OrdenarAfinidades(afinidades: Array<Afinidad>): Array<Afinidad> {
        return afinidades.sort((a, b) => {
            if (a.afinidad < b.afinidad) {
                return 1;
            }

            if (a.afinidad > b.afinidad) {
                return -1;
            }

            return 0;
        });
    }

    private static SumarLista(lista: Array<number>): number {
        let suma: number = 0;

        for (let i = 0; i < lista.length; i++) {
            suma += lista[i];
        }

        return suma;
    }

    private static CalcularPromedioLista(lista: Array<number>): number {
        return this.SumarLista(lista) / lista.length;
    }
}