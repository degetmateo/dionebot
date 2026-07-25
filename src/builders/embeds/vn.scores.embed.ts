import { EmbedBuilder } from "discord.js";

export default class VNScoresEmbed extends EmbedBuilder {
    constructor (scores: Array<{
        id: string;
        username: string;
        vote: number;
        status: string;
    }>) {
        super();

        const completed = scores.filter(score => score.status === 'FINISHED');
        const reading = scores.filter(score => score.status === 'PLAYING');
        const paused = scores.filter(score => score.status === 'PAUSED');
        const dropped = scores.filter(score => score.status === 'DROPPED');
        const unknown = scores.filter(score => score.status === 'UNKNOWN');

        let desc: string = '';

        if (completed.length > 0) {
            desc += `Completed: ${completed.map(s => `[${s.username}](https://vndb.org/${s.id}) **[${s.vote}]**`).join(' - ')}\n\n`
        };

        if (reading.length > 0) {
            desc += `Reading: ${reading.map(s => `[${s.username}](https://vndb.org/${s.id}) **[${s.vote}]**`).join(' - ')}\n\n`
        };

        if (paused.length > 0) {
            desc += `Paused: ${paused.map(s => `[${s.username}](https://vndb.org/${s.id}) **[${s.vote}]**`).join(' - ')}\n\n`
        };

        if (dropped.length > 0) {
            desc += `Dropped: ${dropped.map(s => `[${s.username}](https://vndb.org/${s.id}) **[${s.vote}]**`).join(' - ')}\n\n`
        };

        if (unknown.length > 0) {
            desc += `Unknown: ${unknown.map(s => `[${s.username}](https://vndb.org/${s.id}) **[${s.vote}]**`).join(' - ')}\n\n`
        };

        this.setDescription(desc);
        this.setColor('Random');
    };
};