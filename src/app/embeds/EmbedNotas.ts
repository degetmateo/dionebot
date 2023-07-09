import { ColorResolvable, EmbedBuilder } from "discord.js";
import Notas from "./tads/Notas";
import EmbedUsuario from "./EmbedUsuario";

export default class EmbedNotas extends EmbedBuilder {
    private notas: Notas;

    private constructor (notas: Notas) {
        super();
        this.notas = notas;
    }

    public static Crear (notas: Notas, color: ColorResolvable) {
        const embed = new EmbedNotas(notas).setColor(color);
        
        embed.establecerCampoCompletados();
        embed.establecerCampoEnProgreso();
        embed.establecerCampoDropeados();
        embed.establecerCampoPlaneando();

        return embed;
    }

    private establecerCampoCompletados (): void {
        const usuarios = this.notas.obtenerCompletado();
        if (usuarios.length <= 0) return;

        const informacion = `${this.notas.obtenerCompletado().map(n => n.nombre + ' **[' + n.nota + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Completado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Completado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoEnProgreso (): void {
        const usuarios = this.notas.obtenerProgreso();
        if (usuarios.length <= 0) return;

        const informacion = `${this.notas.obtenerProgreso().map(n => n.nombre + ' **[' + n.nota + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Comenzado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Comenzado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoDropeados (): void {
        const usuarios = this.notas.obtenerDropeado();
        if (usuarios.length <= 0) return;

        const informacion = `${this.notas.obtenerDropeado().map(n => n.nombre + ' **[' + n.nota + ']**').join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Dropeado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Dropeado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }

    private establecerCampoPlaneando (): void {
        const usuarios = this.notas.obtenerPlanificado();
        if (usuarios.length <= 0) return;

        const informacion = `${this.notas.obtenerPlanificado().map(n => n.nombre).join(' - ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Planificado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Planificado por', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
}