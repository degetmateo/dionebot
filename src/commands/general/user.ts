import { ColorResolvable, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import toHex from 'colornames';
import GenericError from "../../errors/genericError";
import mongo from "../../database/mongo";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import anilist from "../../apis/anilist/anilist";
import Aniuser from "../../apis/anilist/models/aniuser";
import mal from "../../apis/mal/mal";
import Helpers from "../../helpers";
import vndb from "../../apis/vndb/vndb";

const execute = async (interaction: GuildChatInputCommandInteraction) => {
    await interaction.deferReply();

    const discordMember = interaction.options.getUser('member') || interaction.user;
    const memberId = discordMember.id;

    const members = mongo.collection('members');
    const member = await members.findOne(
        { 
            discord_id: memberId 
        }
    );
    
    if (!member) {
        if (memberId === interaction.user.id) {
            throw new GenericError(`No estás registrado. Usá \`/setup\` para registrarte.`);
        } else {
            throw new GenericError(`<@${memberId}> no está registrado. Debe usar \`/setup\` para registrarse.`);
        };
    };

    let embed: EmbedBuilder = new EmbedBuilder();

    embed.setTitle(discordMember.globalName);

    let description = `Intercambios completados: **[${member.exchanges.completed_count || 0}]**\n\n`;

    if (member.preferred_platform) {
        if (member.preferred_platform === 'mal') {
            const maluser: any = await mal.user.get({ id: member.mal.id, token: member.mal.auth.access_token });
    
            embed.setURL(`https://myanimelist.net/profile/${maluser.name}`);
            embed.setThumbnail(maluser.picture);
            embed.setColor('Random');
    
            description += 
                `**Información de MyAnimeList**\n`+
                `▸ Conocido como [\`${maluser.name}\`](https://myanimelist.net/profile/${maluser.name})\n`+
                `▸ Se unió el \`${new Date(maluser.joined_at).toDateString()}\`\n`+
                `▸ Cumpleaños: \`${new Date(maluser.birthday).toDateString()}\`\n`+
                `▸ Género: \`${maluser.gender || 'desconocido'}\`\n`+
                `▸ Ubicación: \`${maluser.location || 'desconocida'}\`\n\n`+
                `**Estadísticas en Anime**\n`+
                `▸ Calificación promedio: **[${maluser.anime_statistics.mean_score}]**\n`+
                `▸ Completados: **[${maluser.anime_statistics.num_items_completed}]**\n`+
                `▸ Abandonados: **[${maluser.anime_statistics.num_items_dropped}]**\n`+
                `▸ Episodios vistos: **[${maluser.anime_statistics.num_episodes}]**\n`+
                `▸ Días vistos: **[${maluser.anime_statistics.num_days_watched}]**\n`
            ;
        } else {
            const data = await anilist.search.user(member.anilist.id);
            const aniuser = new Aniuser(data);
    
            embed
                .setURL(aniuser.getSiteURL())
                .setColor((toHex(aniuser.getProfileColor()) as ColorResolvable))
                .setImage(aniuser.getBannerURL())
                .setThumbnail(aniuser.getAvatarURL())
            ;
    
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
                `▸ Conocido como [\`${aniuser.getName()}\`](${aniuser.getSiteURL()})\n`+
                `▸ Se unio el **${aniuser.getCreatedAt().toLocaleDateString()}**\n\n` +
    
                `**[Anime](${aniuser.getSiteURL()}/animelist)**\n` +
                `▸ Completados: **${completedAnime?.count || 0}**\n`+
                `▸ Abandonados: **${droppedAnime?.count || 0}**\n`+
                `▸ En progreso: **${currentAnime?.count || 0}**\n`+
                `▸ Episodios Vistos: **${aniuser.getAnimeEpisodesWatched()}**\n` +
                `▸ Tiempo Visto: **${(aniuser.getAnimeHoursWatched()).toFixed(1)} horas**\n`+
                `▸ Calificación Promedio: **${aniuser.getAnimeMeanScore()}**\n\n`+
    
                `**[Manga](${aniuser.getSiteURL()}/mangalist)**\n`+
                `▸ Completados: **${completedManga?.count || 0}**\n`+
                `▸ Abandonados: **${droppedManga?.count || 0}**\n`+
                `▸ En progreso: **${currentManga?.count || 0}**\n`+
                `▸ Capítulos Leídos: **${aniuser.getMangaChaptersRead()}**\n`+
                `▸ Volúmenes Leídos: **${aniuser.getMangaVolumesRead()}**\n`+
                `▸ Calificación Promedio: **${aniuser.getMangaMeanScore()}**\n\n`+
    
                `**Tendencias**\n`+
                `▸ Más consumido: **${Helpers.capitalizeText(aniuser.getMostConsumedGenre()?.genre)} [${aniuser.getMostConsumedGenre()?.count}]**\n`+
                `▸ Menos consumido: **${Helpers.capitalizeText(aniuser.getLeastConsumedGenre()?.genre)} [${aniuser.getLeastConsumedGenre()?.count}]**\n`+
                `▸ Mejor calificado: **${Helpers.capitalizeText(aniuser.getBestRatedGenre()?.genre)} [${aniuser.getBestRatedGenre().meanScore.toFixed(2)}]**\n`+
                `▸ Peor calificado: **${Helpers.capitalizeText(aniuser.getWorstRatedGenre()?.genre)} [${aniuser.getWorstRatedGenre()?.meanScore.toFixed(2)}]**\n`+
                `▸ Suele gustarle: **${Helpers.capitalizeText(bestBayesianScores.join(' - '))}**\n`+
                `▸ No suele gustarle: **${Helpers.capitalizeText(worstBayesianScores.join(' - '))}**`
            ;
        };
    } else {
        embed.setThumbnail(interaction.user.avatarURL());
        embed.setImage(interaction.user.bannerURL() || null);
        embed.setColor("Random");
    };

    if (member.vndb) {
        const vnuserRequest: {
            more: boolean;
            results: Array<{
                id: string;
                vn: any;
                vote: number | null;
            }>;
        } = await vndb.user({
            id: member.vndb.id,
            token: member.vndb.auth.token
        }) as any;

        let data = vnuserRequest.results;

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
        }> = data.map(d => {
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

        description += `\n\n`;
        description +=
            `**Información de VNDB**\n`+
            `▸ Conocido como [\`${member.vndb.username}\`](https://vndb.org/${member.vndb.id})\n`;

        if (vnText && vnText.length > 1) {
            description += `▸ Top novelas:\n${vnText}\n`;
        };

        if (tagsText && tagsText.length > 1) {
            description += `▸ Etiquetas más consumidas:\n${tagsText}`;
        };
    };

    embed.setDescription(description);

    await interaction.editReply({
        embeds: [embed]
    });
};

module.exports = {
    cooldown: 25,
    data: new SlashCommandBuilder()
        .setName('user')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false)
        .setDescription('All the information related to an user.')
        .setDescriptionLocalization('es-ES', 'Toda la información relacionada a un usuario.')
        .setDescriptionLocalization('es-419', 'Toda la información relacionada a un usuario.')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('The user to get information for.')
                .setDescriptionLocalization('es-ES', 'El usuario del que obtener información.')
                .setDescriptionLocalization('es-419', 'El usuario del que obtener información.')
                .setRequired(false)),
    execute: execute
};