"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedUsuario extends discord_js_1.EmbedBuilder {
    constructor(usuario) {
        super();
        this.usuario = usuario;
    }
    static async CrearPrincipal(usuario) {
        const embed = new EmbedUsuario(usuario);
        embed.establecerColor();
        embed.establecerPortada();
        embed.establecerBanner();
        await embed.establecerDescripcion();
        return embed;
    }
    establecerColor() {
        this.setColor(this.usuario.obtenerColor());
    }
    async establecerDescripcion() {
        const estadisticas = this.usuario.obtenerEstadisticas();
        const generosCantidad = this.usuario.obtenerGenerosOrdenadosPorCantidad();
        const generosCalificacion = this.usuario.obtenerGenerosOrdenadosPorCalificacion();
        const generoMasConsumido = generosCantidad[0];
        const generoMenosConsumido = generosCantidad[generosCantidad.length - 1];
        const generoMejorCalificado = generosCalificacion[0];
        const generoPeorCalificado = generosCalificacion[generosCalificacion.length - 1];
        const mediaPonderadaURL = 'https://es.wikipedia.org/wiki/Media_ponderada';
        const descripcion = `
**[${this.usuario.obtenerNombre()}](${this.usuario.obtenerURL()})**
↪ Se unio el **${this.usuario.obtenerFechaCreacion().toLocaleDateString()}**

**[Anime](${this.usuario.obtenerURL()}/animelist)**
↪ Entradas: **${estadisticas.anime.count}**
↪ Episodios Vistos: **${estadisticas.anime.episodesWatched}**
↪ Tiempo Visto: **${(estadisticas.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${estadisticas.anime.meanScore}**

**[Manga](${this.usuario.obtenerURL()}/mangalist)**
↪ Entradas: **${estadisticas.manga.count}**
↪ Capítulos Leídos: **${estadisticas.manga.chaptersRead}**
↪ Volúmenes Leídos: **${estadisticas.manga.volumesRead}**
↪ Calificación Promedio: **${estadisticas.manga.meanScore}**

**Tendencias**
↪ Más consumido: **${Helpers_1.default.capitalizarTexto(generoMasConsumido.genre)} [${generoMasConsumido.count}]**
↪ Menos consumido: **${Helpers_1.default.capitalizarTexto(generoMenosConsumido.genre)} [${generoMenosConsumido.count}]**
↪ [Mejor](${mediaPonderadaURL}) calificado: **${Helpers_1.default.capitalizarTexto(generoMejorCalificado.genre)} [${generoMejorCalificado.meanScore.toFixed(2)}]** 
↪ [Peor](${mediaPonderadaURL}) calificado: **${Helpers_1.default.capitalizarTexto(generoPeorCalificado.genre)} [${generoPeorCalificado.meanScore.toFixed(2)}]**
        `;
        this.setDescription(descripcion);
    }
    establecerPortada() {
        const avatarURL = this.usuario.obtenerAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }
    establecerBanner() {
        const bannerURL = this.usuario.obtenerBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }
}
exports.default = EmbedUsuario;
EmbedUsuario.LIMITE_CARACTERES_DESCRIPCION = 2048;
EmbedUsuario.LIMITE_CARACTERES_CAMPO = 1024;
