"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed {
    constructor() {
        this.embed = new discord_js_1.EmbedBuilder();
    }
    static Crear() {
        return new Embed();
    }
    establecerDescripcion(texto) {
        this.embed.setDescription(texto);
        return this;
    }
    establecerColor(color) {
        this.embed.setColor(color);
        return this;
    }
    establecerTitulo(titulo) {
        this.embed.setTitle(titulo);
        return this;
    }
    establecerURL(url) {
        this.embed.setURL(url);
        return this;
    }
    establecerBanner(url) {
        this.embed.setImage(url);
        return this;
    }
    establecerPortada(url) {
        this.embed.setThumbnail(url);
        return this;
    }
    establecerFooter(footer) {
        this.embed.setFooter(footer);
        return this;
    }
    establecerCampo(campo) {
        this.embed.addFields(campo);
        return this;
    }
    obtenerDatos() {
        return this.embed.toJSON();
    }
}
Embed.COLOR_ROJO = ('#FF0000');
Embed.COLOR_VERDE = ('#00FF44');
Embed.COLOR_RED = ('#FF0000');
Embed.COLOR_GREEN = ('#00FF44');
Embed.COLOR_YELLOW = ('#fff700');
exports.default = Embed;
