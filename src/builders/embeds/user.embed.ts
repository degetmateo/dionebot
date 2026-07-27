import { ColorResolvable, EmbedBuilder, User } from "discord.js";
import { Document, WithId } from "mongodb";
import toHex from 'colornames';
import Aniuser from "../../apis/anilist/models/aniuser";
import Helpers from "../../helpers";

export default class UserEmbed extends EmbedBuilder {
    private _data: {
        discord_user: User;
        member: WithId<Document>;
        platform: null | 'ANILIST' | 'MAL' | 'VNDB';
        info: Aniuser | null | any;
    };

    private avatarURL: string | null;
    private bannerURL: string | null;
    private color: ColorResolvable | null;
    private description: string;

    constructor (data: {
        discord_user: User;
        member: WithId<Document>;
        platform: null | 'ANILIST' | 'MAL' | 'VNDB';
        info: Aniuser | any;
    }) {
        super();
        this._data = data;

        this.setTitle(data.discord_user.globalName);

        this.avatarURL = data.member.profile ? data.member.profile.avatar_url || null : null;
        this.bannerURL = data.member.profile ? data.member.profile.banner_url || null : null;
        this.color = data.member.profile ? data.member.profile.color as ColorResolvable || null : null;

        this.description =
            `▸ Se unió el \`${new Date(data.member.created_at).toDateString()}\`\n` +
            `▸ Renas \`$${data.member.renas || 0}\`\n` +
            `▸ Personajes reclamados: \`${data.member.claimed_characters_count || 0}\`\n\n`;

        if (data.platform) {
            switch (data.platform) {
                case 'ANILIST':
                    this.anilist();
                    break;
                case 'MAL':
                    this.mal();
                    break;
                case 'VNDB':
                    this.vndb();
                default:
                    break;
            };
        };

        if (!this.avatarURL) this.avatarURL = data.discord_user.avatarURL();
        if (!this.bannerURL) this.bannerURL = data.discord_user.bannerURL({ size: 1024 }) || null;
        if (!this.color) this.color = "Random";

        if (this.avatarURL) this.setThumbnail(this.avatarURL);
        if (this.bannerURL) this.setImage(this.bannerURL);
        if (this.color) this.setColor(this.color);

        this.setDescription(this.description);
    };

    private anilist () {
        const aniuser: Aniuser = this._data.info;
        
        if (!aniuser) {
            return this.description +=
                '▸ No hemos podido recopilar información de \`ANILIST\`. Ver \`/setup\`.'
        };

        if (!this.avatarURL) {
            this.avatarURL = aniuser.getAvatarURL();
        };

        if (!this.bannerURL) {
            this.bannerURL = aniuser.getBannerURL();
        };

        if (!this.color) {
            this.color = (toHex(aniuser.getProfileColor()) as ColorResolvable);
        };

        const bestBayesianScores = aniuser.getGenresSortedByBayesianScore().slice(0, 3).map(g => g.genre);

        const worstBayesianScores = aniuser.getGenresSortedByBayesianScore().slice(aniuser.getGenresSortedByBayesianScore().length - 3, aniuser.getGenresSortedByBayesianScore().length).map(g => g.genre);

        const completedAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status == 'COMPLETED');
        const droppedAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status == 'DROPPED');
        const currentAnime = aniuser.data.statistics.anime.statuses.find((s: any) => s.status=='CURRENT');

        const completedManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status == 'COMPLETED');
        const droppedManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status == 'DROPPED');
        const currentManga = aniuser.data.statistics.manga.statuses.find((s: any) => s.status=='CURRENT');

        this.description +=
            `**Información de ANILIST**\n` +
            `▸ Conocido como [\`${aniuser.getName()}\`](${aniuser.getSiteURL()})\n`+
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
    };

    private mal () {
        const maluser = this._data.info;

        if (!maluser) {
            return this.description +=
                '▸ No hemos podido recopilar información de \`MyAnimeList\`. Ver \`/setup\`.'
        };

        if (!this.avatarURL) {
            this.avatarURL = maluser.picture;
        };

        if (!this.color) {
            this.color = 'Random';
        };

        this.description += 
            `**Información de MyAnimeList**\n`+
            `▸ Conocido como [\`${maluser.name}\`](https://myanimelist.net/profile/${maluser.name})\n`+
            `▸ Se unió el \`${new Date(maluser.joined_at).toDateString()}\`\n`+
            `▸ Cumpleaños: \`${new Date(maluser.birthday).toDateString()}\`\n`+
            `▸ Género: \`${maluser.gender || 'desconocido'}\`\n`+
            `▸ Ubicación: \`${maluser.location || 'desconocida'}\`\n\n`+
            `**Estadísticas en Anime**\n`+
            `▸ Calificación promedio: \`${maluser.anime_statistics.mean_score}\`\n`+
            `▸ Completados: \`${maluser.anime_statistics.num_items_completed}\`\n`+
            `▸ Abandonados: \`${maluser.anime_statistics.num_items_dropped}\`\n`+
            `▸ Episodios vistos: \`${maluser.anime_statistics.num_episodes}\`\n`+
            `▸ Días vistos: \`${maluser.anime_statistics.num_days_watched}\`\n`
        ;
    };

    private vndb () {
        const info = this._data.info;

        if (!info) {
            return this.description +=
                '▸ No hemos podido recopilar información de \`Visual Novel Database\`. Ver \`/setup\`.'
        };

        let data = info.results;

        let parsed: Array<{
            id: string;
            title: string;
            vote: number;
            length: number;
            developers: any[];
            tags: Array<{
                id: string;
                category: string;
                name: string;
            }>;
        }> = data.map((d: any) => {
            return {
                id: d.id,
                title: d.vn.title,
                vote: d.vote || 0,
                length: d.vn.length,
                developers: d.vn.developers,
                tags: d.vn.tags,
            }
        });

        parsed.sort((a, b) => b.vote - a.vote);

        let tags: Array<{
            id: string;
            name: string;
            category: string;
            count: number;
        }> = [];

        for (const vn of parsed) {
            for (const tag of vn.tags) {
                let found = false;
                for (let i = 0; i < tags.length; i++) {
                    if (tags[i].id === tag.id) {
                        found = true;
                        tags[i].count = tags[i].count + 1;
                        break;
                    };
                };

                if (!found) {
                    tags.push({
                        id: tag.id,
                        name: tag.name,
                        category: tag.category,
                        count: 1
                    });
                };
            };
        };

        const tagsSortedByCount = tags.sort((a, b) => b.count - a.count);
        const tagsText = tagsSortedByCount.slice(0, 12).map(t => `\`${t.name} [${t.count}]\``).join(' ');

        const bestScores = parsed.slice(0, 10);
        const vnText = bestScores.map(vn => `[\`${vn.title} [${vn.vote}]\`](https://vndb.org/${vn.id})`).join(' ');

        let total_score = 0;
        for (const p of parsed) {
            total_score += p.vote || 0;
        };
        const averageScore = total_score / parsed.length;

        let totalVNSText = '';
        if (info.more) {
            totalVNSText = `▸ Cantidad de novelas: \`más de ${parsed.length}\``;
        } else {
            totalVNSText = `▸ Cantidad de novelas: \`${parsed.length}\``;
        };

        this.description +=
            `**Información de VNDB**\n`+
            `▸ Conocido como [\`${this._data.member.vndb.username}\`](https://vndb.org/${this._data.member.vndb.id})\n`+
            `${totalVNSText}\n`+
            `▸ Promedio de calificación: \`${averageScore.toFixed(2)} (aproximado)\`\n`;

        if (vnText && vnText.length > 1) {
            this.description += `▸ Top novelas:\n${vnText}\n`;
        };

        if (tagsText && tagsText.length > 1) {
            this.description += `▸ Etiquetas más consumidas:\n${tagsText}`;
        };
    };
};