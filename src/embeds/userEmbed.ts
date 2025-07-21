import { ColorResolvable, EmbedBuilder } from "discord.js";
import toHex from 'colornames';
import Helpers from "../helpers";
import AnilistUser from "../models/anilist/anilistUser";

export default class UserEmbed extends EmbedBuilder {
    constructor (user: AnilistUser) {
        super();
        
        this
            .setColor((toHex(user.getProfileColor()) as ColorResolvable))
            .setImage(user.getBannerURL())
            .setThumbnail(user.getAvatarURL())

        const bestBayesianScores = user.getGenresSortedByBayesianScore().slice(0, 3).map(g => g.genre);

        const worstBayesianScores = user.getGenresSortedByBayesianScore().slice(user.getGenresSortedByBayesianScore().length - 3, user.getGenresSortedByBayesianScore().length).map(g => g.genre);


        this.setDescription((`
**[${user.getName()}](${user.getSiteURL()})**
↪ Se unio el **${user.getCreatedAt().toLocaleDateString()}**

**[Anime](${user.getSiteURL()}/animelist)**
↪ Cantidad: **${user.getAnimeCount()}**
↪ Episodios Vistos: **${user.getAnimeEpisodesWatched()}**
↪ Tiempo Visto: **${(user.getAnimeHoursWatched()).toFixed(1)} horas**
↪ Calificación Promedio: **${user.getAnimeMeanScore()}**

**[Manga](${user.getSiteURL()}/mangalist)**
↪ Cantidad: **${user.getMangaCount()}**
↪ Capítulos Leídos: **${user.getMangaChaptersRead()}**
↪ Volúmenes Leídos: **${user.getMangaVolumesRead()}**
↪ Calificación Promedio: **${user.getMangaMeanScore()}**

**Tendencias**
↪ Más consumido: **${Helpers.capitalizeText(user.getMostConsumedGenre().genre)} [${user.getMostConsumedGenre().count}]**
↪ Menos consumido: **${Helpers.capitalizeText(user.getLeastConsumedGenre().genre)} [${user.getLeastConsumedGenre().count}]**

↪ Mejor calificado: **${Helpers.capitalizeText(user.getBestRatedGenre().genre)} [${user.getBestRatedGenre().meanScore.toFixed(2)}]** 
↪ Peor calificado: **${Helpers.capitalizeText(user.getWorstRatedGenre().genre)} [${user.getWorstRatedGenre().meanScore.toFixed(2)}]**

↪ Suele gustarle: **${Helpers.capitalizeText(bestBayesianScores.join(' - '))}** 
↪ Suele odiar: **${Helpers.capitalizeText(worstBayesianScores.join(' - '))}**
    `).trim());
    };
};