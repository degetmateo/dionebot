import { ColorResolvable, EmbedBuilder } from "discord.js";
import toHex from 'colornames';
import Helpers from "../helpers";

export default class UserEmbed extends EmbedBuilder {
    constructor (user: any) {
        super();
        
        this
            .setColor(user.options.profileColor ? (toHex(user.options.profileColor) as ColorResolvable) : 'Random')
            .setImage(user.bannerImage)
            .setThumbnail(user.avatar.large || user.avatar.medium)

        const date = new Date(user.createdAt * 1000);

        const statistics = user.statistics;
        const animeGenres = statistics.anime.genres;
        const mangaGenres = statistics.manga.genres;

        let mostConsumedGenre = null;

        for (const ga of animeGenres) {
            if (!mostConsumedGenre) mostConsumedGenre = ga;
            const gm = mangaGenres.find(g => g.genre === ga.genre);
            if (!gm) continue;
            const count = ga.count + gm.count;
            (count > mostConsumedGenre.count) ? mostConsumedGenre = ga : null;
        };

        const genres: Array<{
            genre: string;
            count: number;
            meanScore: number;
        }> = animeGenres;

        for (const mangaGenre of mangaGenres) {
            const genre = genres.find(g => g.genre === mangaGenre.genre);
            
            if (!genre) {
                 genres.push({
                    genre: mangaGenre.genre,
                    count: mangaGenre.count,
                    meanScore: mangaGenre.meanScore,
                 });

                 continue;
            };

            genre.count += mangaGenre.count;
            genre.meanScore = (genre.meanScore + mangaGenre.meanScore) / 2;
        };

        let meanScore = 0;

        for (const genre of genres) {
            meanScore = meanScore + genre.meanScore;
        };

        meanScore = meanScore / genres.length;

        const bayesianGenres = (genres.map(genre => {
            const score = (5 * meanScore + genre.meanScore * genre.count) / (5 + genre.count);
            return {
                ...genre,
                bayesianScore: score
            };
        }));

        const genresSortedByQuantity = Array.from(genres).sort((a, b) => b.count - a.count);
        const genresSortedByBayesianScore = Array.from(bayesianGenres).sort((a, b) => b.bayesianScore - a.bayesianScore);
        const genresSortedByMeanScore = Array.from(genres).sort((a, b) => b.meanScore - a.meanScore);

        mostConsumedGenre = genresSortedByQuantity[0] ||
        { genre: 'N/A', count: '[-]', meanScore: 0, bayesianScore: 0 };

        const leastConsumedGenre = genresSortedByQuantity[genresSortedByQuantity.length - 1] || 
        { genre: 'N/A', count: '[-]', meanScore: 0, bayesianScore: 0 };

        const bestRatedGenre = genresSortedByMeanScore[0] ||
        { genre: 'N/A', count: '[-]', meanScore: 0, bayesianScore: 0 };

        const worstRatedGenre = genresSortedByMeanScore[genresSortedByMeanScore.length - 1] ||
        { genre: 'N/A', count: '[-]', meanScore: 0, bayesianScore: 0 };

        const bestBayesianScores = genresSortedByBayesianScore.slice(0, 3).map(g => g.genre);

        const worstBayesianScores = genresSortedByBayesianScore.slice(genresSortedByBayesianScore.length - 3, genresSortedByBayesianScore.length).map(g => g.genre);


        this.setDescription((`
**[${user.name}](${user.siteUrl})**
↪ Se unio el **${date.toLocaleDateString()}**

**[Anime](${user.siteUrl}/animelist)**
↪ Cantidad: **${user.statistics.anime.count}**
↪ Episodios Vistos: **${user.statistics.anime.episodesWatched}**
↪ Tiempo Visto: **${(user.statistics.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${user.statistics.anime.meanScore}**

**[Manga](${user.siteUrl}/mangalist)**
↪ Cantidad: **${user.statistics.manga.count}**
↪ Capítulos Leídos: **${user.statistics.manga.chaptersRead}**
↪ Volúmenes Leídos: **${user.statistics.manga.volumesRead}**
↪ Calificación Promedio: **${user.statistics.manga.meanScore}**

**Tendencias**
↪ Más consumido: **${Helpers.capitalizeText(mostConsumedGenre.genre)} [${mostConsumedGenre.count}]**
↪ Menos consumido: **${Helpers.capitalizeText(leastConsumedGenre.genre)} [${leastConsumedGenre.count}]**
↪ Mejor calificado: **${Helpers.capitalizeText(bestRatedGenre.genre)} [${bestRatedGenre.meanScore.toFixed(2)}]** 
↪ Peor calificado: **${Helpers.capitalizeText(worstRatedGenre.genre)} [${worstRatedGenre.meanScore.toFixed(2)}]**
↪ Suele gustarle: **${Helpers.capitalizeText(bestBayesianScores.join(' - '))}** 
↪ Suele odiar: **${Helpers.capitalizeText(worstBayesianScores.join(' - '))}**
    `).trim());
    };
};