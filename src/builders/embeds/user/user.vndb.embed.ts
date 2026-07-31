import { EmbedBuilder } from "discord.js";

export default class UserVNDBEmbed extends EmbedBuilder {
    constructor (vndbuser: any) {
        super();

        this.setTitle(vndbuser.name);
        this.setURL(`https://vndb.org/${vndbuser.id}`);
        this.setColor(vndbuser.color);
        this.setThumbnail(vndbuser.avatar);
        this.setImage(vndbuser.banner);

        let description: string = '';
        let data = vndbuser.results;

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
        if (vndbuser.more) {
            totalVNSText = `▸ Cantidad de novelas: \`más de ${parsed.length}\``;
        } else {
            totalVNSText = `▸ Cantidad de novelas: \`${parsed.length}\``;
        };

        description +=
            `**Información de VNDB**\n`+
            `${totalVNSText}\n`+
            `▸ Promedio de calificación: \`${averageScore.toFixed(2)} (aproximado)\`\n`;

        if (vnText && vnText.length > 1) {
            description += `▸ Top novelas:\n${vnText}\n`;
        };

        if (tagsText && tagsText.length > 1) {
            description += `▸ Etiquetas más consumidas:\n${tagsText}`;
        };

        this.setDescription(description);
    };
};