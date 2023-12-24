"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const EmbedUsuario_1 = __importDefault(require("./EmbedUsuario"));
class EmbedNotas extends discord_js_1.EmbedBuilder {
    constructor(notas, media) {
        super();
        this.notas = notas;
        this.media = media;
    }
    static Crear(notas, media) {
        const embed = new EmbedNotas(notas, media)
            .setColor(media.obtenerColor());
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
    establecerCampoCompletados() {
        const usuarios = this.notas.obtenerCompletado();
        if (usuarios.length <= 0)
            return;
        const informacion = `${usuarios.map(n => n.user.name + ' **[' + n.score + ']**').join(' - ')}`;
        informacion.length <= EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Completado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Completado por', value: informacion.slice(0, EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
    establecerCampoEnProgreso() {
        const usuarios = this.notas.obtenerProgreso();
        if (usuarios.length <= 0)
            return;
        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;
        informacion.length <= EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Comenzado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Comenzado por', value: informacion.slice(0, EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
    establecerCampoEnPausa() {
        const usuarios = this.notas.obtenerPausado();
        if (usuarios.length <= 0)
            return;
        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;
        informacion.length <= EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Pausado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Pausado por', value: informacion.slice(0, EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
    establecerCampoDropeados() {
        const usuarios = this.notas.obtenerDropeado();
        if (usuarios.length <= 0)
            return;
        const informacion = `${usuarios.map(n => n.user.name + ' **(' + n.progress + ')**' + ' **[' + n.score + ']**').join(' - ')}`;
        informacion.length <= EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Dropeado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Dropeado por', value: informacion.slice(0, EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
    establecerCampoPlaneando() {
        const usuarios = this.notas.obtenerPlanificado();
        if (usuarios.length <= 0)
            return;
        const informacion = `${this.notas.obtenerPlanificado().map(n => n.user.name).join(' - ')}`;
        informacion.length <= EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Planificado por', value: informacion, inline: false }) :
            this.addFields({ name: 'Planificado por', value: informacion.slice(0, EmbedUsuario_1.default.LIMITE_CARACTERES_CAMPO - 4) + '\n...', inline: false });
    }
    estaVacio() {
        return (!this.toJSON().description && !this.toJSON().fields);
    }
}
exports.default = EmbedNotas;
