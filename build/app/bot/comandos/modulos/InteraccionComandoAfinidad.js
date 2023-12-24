"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const UsuarioAnilist_1 = __importDefault(require("../../apis/anilist/modelos/UsuarioAnilist"));
const Boton_1 = __importDefault(require("../componentes/Boton"));
const ErrorArgumentoInvalido_1 = __importDefault(require("../../../errores/ErrorArgumentoInvalido"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const InteraccionComandoUnsetup_1 = __importDefault(require("./InteraccionComandoUnsetup"));
class InteraccionComandoAfinidad extends InteraccionComando_1.default {
    constructor(interaction) {
        var _a;
        super();
        this.botonPaginaPrevia = Boton_1.default.CrearPrevio();
        this.botonPaginaSiguiente = Boton_1.default.CrearSiguiente();
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);
        this.interaction = interaction;
        this.bot = interaction.client;
        this.serverID = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        this.usuario = this.interaction.options.getUser("usuario");
        this.embeds = new Array();
        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = 0;
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoAfinidad(interaction);
        await modulo.execute();
    }
    async execute() {
        await this.interaction.deferReply();
        const usuarioID = (!this.usuario) ? this.interaction.user.id : this.usuario.id;
        let usuariosRegistrados = this.bot.usuarios.obtenerUsuariosRegistrados(this.serverID);
        usuariosRegistrados = Helpers_1.default.eliminarElementosRepetidos(usuariosRegistrados);
        const usuarioRegistrado = usuariosRegistrados.find(u => u.discordId === usuarioID);
        if (!usuarioRegistrado)
            throw new ErrorArgumentoInvalido_1.default('Tu o el usuario especificado no estan registrados.');
        let busquedaUsuario;
        try {
            busquedaUsuario = await AnilistAPI_1.default.buscarUsuario(usuarioRegistrado.anilistUsername);
        }
        catch (error) {
            if (error instanceof ErrorSinResultados_1.default) {
                throw new ErrorSinResultados_1.default(`No se ha encontrado al usuario **${usuarioRegistrado.anilistUsername}** en anilist. Puede que se haya cambiado el nombre.`);
            }
            throw error;
        }
        const usuario = new UsuarioAnilist_1.default(busquedaUsuario);
        let afinidades = await this.obtenerAfinidadesUsuario(usuario, usuariosRegistrados);
        afinidades = Helpers_1.default.eliminarElementosRepetidos(afinidades);
        if (!afinidades || afinidades.length <= 0)
            throw new ErrorSinResultados_1.default('No hay afinidades disponibles.');
        this.embeds = InteraccionComandoAfinidad.obtenerEmbeds(usuario, afinidades);
        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = this.embeds.length - 1;
        const embed = this.embeds[this.indiceInteraccion];
        const respuesta = await this.interaction.editReply({
            embeds: [embed],
            components: [this.row]
        });
        try {
            const collector = respuesta.createMessageComponentCollector({
                time: InteraccionComando_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (boton) => {
                await boton.deferUpdate();
                if (boton.customId === Boton_1.default.BotonPrevioID) {
                    this.indiceInteraccion--;
                    if (this.indiceInteraccion < 0)
                        this.indiceInteraccion = this.ultimoIndiceInteraccion;
                }
                if (boton.customId === Boton_1.default.BotonSiguienteID) {
                    this.indiceInteraccion++;
                    if (this.indiceInteraccion > this.ultimoIndiceInteraccion)
                        this.indiceInteraccion = 0;
                }
                await this.actualizarInteraccion(boton);
            });
        }
        catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }
    async actualizarInteraccion(boton) {
        try {
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] });
        }
        catch (error) {
            console.error(error);
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [] });
        }
    }
    static obtenerEmbeds(usuario, afinidades) {
        const embeds = Array();
        const numEmbeds = (afinidades.length / 10) + 1;
        for (let i = 0; i < numEmbeds; i++) {
            let parteActual = afinidades.slice(i * 10, (i * 10) + 10);
            let parteActualChequeada = new Array();
            for (const p of parteActual) {
                if (p)
                    parteActualChequeada.push(p);
            }
            if (parteActualChequeada.length <= 0)
                continue;
            const embed = new discord_js_1.EmbedBuilder();
            const informacion = parteActualChequeada.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.afinidad}%]** ▸ ${a.nombre}`).join('\n');
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
    async obtenerAfinidadesUsuario(usuario, usuarios) {
        var _a;
        const datos = await AnilistAPI_1.default.buscarListasCompletadosUsuarios(usuario, usuarios);
        const mediaColeccionUsuario = datos.user;
        const mediaColeccionUsuarios = Helpers_1.default.eliminarElementosRepetidos(datos.users);
        const listaMediaUsuario = mediaColeccionUsuario.lists[0];
        if (!listaMediaUsuario)
            throw new Error('Ha ocurrido un error inesperado.');
        const mediaCompletadaUsuario = listaMediaUsuario.entries;
        const afinidades = [];
        for (const u of usuarios) {
            if (u.anilistUsername == usuario.obtenerNombre() || !u.anilistUsername || !u.anilistId) {
                continue;
            }
            const listaMediaUsuario2 = (_a = mediaColeccionUsuarios.find(m => m.user.id === parseInt(u.anilistId))) === null || _a === void 0 ? void 0 : _a.lists[0];
            if (!listaMediaUsuario2)
                continue;
            const mediaCompletadaUsuario2 = listaMediaUsuario2.entries;
            const resultado = await InteraccionComandoAfinidad.HandleAffinity(mediaCompletadaUsuario, mediaCompletadaUsuario2);
            const usuarioDiscord = await this.bot.users.fetch(u.discordId);
            if (!usuarioDiscord)
                continue;
            const nombre = usuarioDiscord.username;
            if (nombre.includes('Deleted User')) {
                await InteraccionComandoUnsetup_1.default.UnsetupUsuario(this.serverID, u.discordId);
                continue;
            }
            afinidades.push({ nombre: nombre, afinidad: parseFloat(resultado.toFixed(2)) });
        }
        return InteraccionComandoAfinidad.OrdenarAfinidades(afinidades);
    }
    static async HandleAffinity(animes1, animes2) {
        const mediaCompartida = InteraccionComandoAfinidad.ObtenerMediaCompartida(animes1, animes2);
        return this.CalcularAfinidad(mediaCompartida);
    }
    static ObtenerMediaCompartida(l1, l2) {
        const mediaCompartida = new Array();
        for (const media of l1) {
            const media2 = l2.find(m => m.mediaId === media.mediaId);
            if (!media2)
                continue;
            mediaCompartida.push({ id: media.mediaId, scoreA: media.score, scoreB: media2.score });
        }
        return mediaCompartida;
    }
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param mediaCompartida Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    static CalcularAfinidad(mediaCompartida) {
        const scoresA = mediaCompartida.map(media => media.scoreA);
        const scoresB = mediaCompartida.map(media => media.scoreB);
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
    static OrdenarAfinidades(afinidades) {
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
    static SumarLista(lista) {
        let suma = 0;
        for (let i = 0; i < lista.length; i++) {
            suma += lista[i];
        }
        return suma;
    }
    static CalcularPromedioLista(lista) {
        return this.SumarLista(lista) / lista.length;
    }
}
exports.default = InteraccionComandoAfinidad;
InteraccionComandoAfinidad.zip = (a, b) => a.map((k, i) => [k, b[i]]);
