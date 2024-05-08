"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedUser extends discord_js_1.EmbedBuilder {
    constructor(user) {
        super();
        this.user = user;
    }
    static Create(user) {
        const embed = new EmbedUser(user);
        embed.establecerColor();
        embed.establecerPortada();
        embed.establecerBanner();
        embed.establecerDescripcion();
        return embed;
    }
    establecerColor() {
        this.setColor(this.user.getColor());
    }
    establecerDescripcion() {
        const estadisticas = this.user.getStatistics();
        const generosCantidad = this.user.getGenresSortedByQuantity();
        const generosCalificacion = this.user.getGenresSortedByCalification();
        const generoMasConsumido = generosCantidad[0] || { genre: 'Desconocido', count: '-', meanScore: 0 };
        const generoMenosConsumido = generosCantidad[generosCantidad.length - 1] || { genre: 'Desconocido', count: '-', meanScore: 0 };
        const generoMejorCalificado = generosCalificacion[0] || { genre: 'Desconocido', count: '-', meanScore: 0 };
        const generoPeorCalificado = generosCalificacion[generosCalificacion.length - 1] || { genre: 'Desconocido', count: '-', meanScore: 0 };
        const mediaPonderadaURL = 'https://es.wikipedia.org/wiki/Media_ponderada';
        const descripcion = `
**[${this.user.getName()}](${this.user.getURL()})**
↪ Se unio el **${this.user.getCreationDate().toLocaleDateString()}**

**[Anime](${this.user.getURL()}/animelist)**
↪ Cantidad: **${estadisticas.anime.count}**
↪ Episodios Vistos: **${estadisticas.anime.episodesWatched}**
↪ Tiempo Visto: **${(estadisticas.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${estadisticas.anime.meanScore}**

**[Manga](${this.user.getURL()}/mangalist)**
↪ Cantidad: **${estadisticas.manga.count}**
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
        const avatarURL = this.user.getAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }
    establecerBanner() {
        const bannerURL = this.user.getBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }
}
EmbedUser.LIMITE_CARACTERES_DESCRIPCION = 2048;
EmbedUser.LIMITE_CARACTERES_CAMPO = 1024;
exports.default = EmbedUser;
