import { EmbedBuilder } from "discord.js";

export default class ScoresEmbed extends EmbedBuilder {
    constructor (results: Array<{
        user: {
            id: string;
            name: string;
        },
        progress: number;
        repeat: number;
        score: number;
        status: "COMPLETED" | "DROPPED" | "CURRENT" | "PAUSED" | "REPEATING" | "PLANNING";
    }>) {
        super();

        const completed = results.filter(r => r.status === 'COMPLETED');
        const current = results.filter(r => r.status === 'CURRENT');
        const dropped = results.filter(r => r.status === 'DROPPED');
        const paused = results.filter(r => r.status === 'PAUSED');
        const repeating = results.filter(r => r.status === 'REPEATING');
        const planning = results.filter(r => r.status === 'PLANNING');

        let description = '';

        const meanServerScore = results.reduce((acc, curr) => acc + curr.score, 0) / results.length;

        description += `Promedio del Servidor: **[${meanServerScore.toFixed(2)}]**\n\n`;

        if (completed.length > 0) {
            description += `▸ Completed: ${completed.map(r => `**${r.user.name} [${r.score}] [x${r.repeat+1}]**`).join(' - ')}\n\n`;
        };

        if (current.length > 0) {
            description += `▸ In Progress: ${current.map(r => `**${r.user.name} (${r.progress}) [${r.score}]**`).join(' - ')}\n\n`;
        };

        if (dropped.length > 0) {
            description += `▸ Dropped: ${dropped.map(r => `**${r.user.name} (${r.progress}) [${r.score}]**`).join(' - ')}\n\n`;
        };

        if (paused.length > 0) {
            description += `▸ Paused: ${paused.map(r => `**${r.user.name} (${r.progress}) [${r.score}]**`).join(' - ')}\n\n`;
        };

        if (repeating.length > 0) {
            description += `▸ Repeating: ${repeating.map(r => `**${r.user.name} (${r.progress}) [${r.score}]**`).join(' - ')}\n\n`;
        };

        if (planning.length > 0) {
            description += `▸ Planning: ${planning.map(r => `**${r.user.name}**`).join(' - ')}\n\n`;
        };

        if (description.length > 4096) {
            description = description.slice(0, 4000) + '...';
        };

        this.setColor('Green');
        this.setDescription(description);
    };
};