import { EmbedBuilder } from "discord.js";

export default class UserMALEmbed extends EmbedBuilder {
    constructor (maluser: any) {
        super();

        let description: string = '';

        this.setTitle(maluser.name);
        this.setURL(`https://myanimelist.net/profile/${maluser.name}`);
        this.setThumbnail(maluser.picture);
        this.setColor('Random');

        description +=
            `**Información de MAL**\n` +
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

        this.setDescription(description);
    };
};