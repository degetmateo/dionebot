import { EmbedBuilder } from "discord.js";
import EmbedUser from "./EmbedUser";
import ScoreCollection from "../apis/anilist/ScoreCollection";

export default class EmbedScores extends EmbedBuilder {
    private scores: ScoreCollection;

    private constructor (scores: ScoreCollection) {
        super();
        this.scores = scores;
    }

    public static Create (scores: ScoreCollection) {
        const embed = new EmbedScores(scores);

        if (scores.isEmpty()) {
            return embed.setDescription('No hay notas disponibles.');
        }

        embed
            .setImage('https://cdn.discordapp.com/attachments/712773186336456766/1130341488652456066/2000x10-ffffffff.png');

        embed.establecerCampoCompletados();
        embed.establecerCampoEnProgreso();
        embed.establecerCampoEnPausa();
        embed.establecerCampoDropeados();
        embed.establecerCampoPlaneando();

        return embed;
    }

    private establecerCampoCompletados (): void {
        const usuarios = this.scores.getCompleted();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => {
            return n.repeat > 0 ?
                n.user.name +  ` **[${n.score}] [x${n.repeat + 1}]**` :
                n.user.name +  ` **[${n.score}]**`;
        }).join(' - ')}`;

        informacion.length <= EmbedUser.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Completado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Completado por', value: informacion.slice(0, EmbedUser.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoEnProgreso (): void {
        const usuarios = this.scores.getCurrent();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUser.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Comenzado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Comenzado por', value: informacion.slice(0, EmbedUser.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoEnPausa (): void {
        const usuarios = this.scores.getPaused();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUser.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Pausado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Pausado por', value: informacion.slice(0, EmbedUser.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoDropeados (): void {
        const usuarios = this.scores.getDropped();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUser.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Dropeado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Dropeado por', value: informacion.slice(0, EmbedUser.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoPlaneando (): void {
        const usuarios = this.scores.getPlanning();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name).join(' - ')}`;

        informacion.length <= EmbedUser.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Planificado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Planificado por', value: informacion.slice(0, EmbedUser.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    public estaVacio (): boolean {
        return (!this.toJSON().description && !this.toJSON().fields);
    }
}