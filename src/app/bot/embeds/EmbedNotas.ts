import { EmbedBuilder } from "discord.js";
import Notas from "../apis/anilist/modelos/media/Notas";
import Media from "../apis/anilist/modelos/media/Media";
import EmbedUsuario from "./EmbedUsuario";

export default class EmbedNotas extends EmbedBuilder {
    private notas: Notas;
    private media: Media;

    private constructor (notas: Notas, media: Media) {
        super();
        this.notas = notas;
        this.media = media;
    }

    public static Crear (notas: Notas, media: Media) {
        const embed = new EmbedNotas(notas, media)
            .setColor(media.obtenerColor())

        if (!notas.hayNotas()) {
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
        const usuarios = this.notas.obtenerCompletado();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Completado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Completado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoEnProgreso (): void {
        const usuarios = this.notas.obtenerProgreso();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Comenzado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Comenzado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoEnPausa (): void {
        const usuarios = this.notas.obtenerPausado();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Pausado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Pausado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoDropeados (): void {
        const usuarios = this.notas.obtenerDropeado();
        if (usuarios.length <= 0) return;

        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Dropeado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Dropeado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoPlaneando (): void {
        const usuarios = this.notas.obtenerPlanificado();
        if (usuarios.length <= 0) return;

        const informacion = `${this.notas.obtenerPlanificado().map(n => n.user.name).join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Planificado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Planificado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    public estaVacio (): boolean {
        return (!this.toJSON().description && !this.toJSON().fields);
    }
}