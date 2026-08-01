import { ColorResolvable, EmbedBuilder } from "discord.js";
import toHex from 'colornames';
import Aniuser from "../../../apis/anilist/models/aniuser";
import Helpers from "../../../helpers";

export default class UserAnilistEmbed extends EmbedBuilder {
    constructor (aniuser: Aniuser) {
        super();

        let description: string = '';

        this.setTitle(aniuser.getName());
        this.setURL(aniuser.getSiteURL());
        this.setThumbnail(aniuser.getAvatarURL());
        this.setImage(aniuser.getBannerURL());
        const profileColor = aniuser.getProfileColor();

        let color: ColorResolvable;
        if (profileColor) {
            if (profileColor.startsWith('#')) {
                color = profileColor as ColorResolvable;
            } else {
                color = toHex(profileColor) as ColorResolvable;
            };
        } else {
            color = "Random";
        };

        this.setColor(color);

        const bestBayesianScores = aniuser.getGenresSortedByBayesianScore().slice(0, 3).map(g => g.genre);
        const worstBayesianScores = aniuser.getGenresSortedByBayesianScore().slice(aniuser.getGenresSortedByBayesianScore().length - 3, aniuser.getGenresSortedByBayesianScore().length).map(g => g.genre);

        const completedAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status == 'COMPLETED');
        const droppedAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status == 'DROPPED');
        const currentAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status=='CURRENT');

        const completedManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status == 'COMPLETED');
        const droppedManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status == 'DROPPED');
        const currentManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status=='CURRENT');

        description +=
            `**Información de ANILIST**\n` +
            `▸ Se unio el \`${aniuser.getCreatedAt().toLocaleDateString()}\`\n\n` +

            `**[Anime](${aniuser.getSiteURL()}/animelist)**\n` +
            `▸ Completados: \`${completedAnime?.count || 0}\`\n`+
            `▸ Abandonados: \`${droppedAnime?.count || 0}\`\n`+
            `▸ En progreso: \`${currentAnime?.count || 0}\`\n`+
            `▸ Episodios Vistos: \`${aniuser.getAnimeEpisodesWatched()}\`\n` +
            `▸ Tiempo Visto: \`${(aniuser.getAnimeHoursWatched()).toFixed(1)} horas\`\n`+
            `▸ Calificación Promedio: \`${aniuser.getAnimeMeanScore()}\`\n\n`+

            `**[Manga](${aniuser.getSiteURL()}/mangalist)**\n`+
            `▸ Completados: \`${completedManga?.count || 0}\`\n`+
            `▸ Abandonados: \`${droppedManga?.count || 0}\`\n`+
            `▸ En progreso: \`${currentManga?.count || 0}\`\n`+
            `▸ Capítulos Leídos: \`${aniuser.getMangaChaptersRead()}\`\n`+
            `▸ Volúmenes Leídos: \`${aniuser.getMangaVolumesRead()}\`\n`+
            `▸ Calificación Promedio: \`${aniuser.getMangaMeanScore()}\`\n\n`+

            `**Tendencias**\n`+
            `▸ Más consumido: \`${Helpers.capitalizeText(aniuser.getMostConsumedGenre()?.genre)} [${aniuser.getMostConsumedGenre()?.count}]\`\n`+
            `▸ Menos consumido: \`${Helpers.capitalizeText(aniuser.getLeastConsumedGenre()?.genre)} [${aniuser.getLeastConsumedGenre()?.count}]\`\n`+
            `▸ Mejor calificado: \`${Helpers.capitalizeText(aniuser.getBestRatedGenre()?.genre)} [${aniuser.getBestRatedGenre().meanScore.toFixed(2)}]\`\n`+
            `▸ Peor calificado: \`${Helpers.capitalizeText(aniuser.getWorstRatedGenre()?.genre)} [${aniuser.getWorstRatedGenre()?.meanScore.toFixed(2)}]\`\n`+
            `▸ Suele gustarle: \`${Helpers.capitalizeText(bestBayesianScores.join(' - '))}\`\n`+
            `▸ No suele gustarle: \`${Helpers.capitalizeText(worstBayesianScores.join(' - '))}\``
        ;

        this.setDescription(description);
    };
};