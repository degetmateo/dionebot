"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Boton extends discord_js_1.ButtonBuilder {
    constructor() {
        super({
            type: discord_js_1.ComponentType.Button,
            style: discord_js_1.ButtonStyle.Primary,
        });
    }
    static CrearSiguiente() {
        return new Boton()
            .setLabel(Boton.BotonSiguienteLabel)
            .setCustomId(Boton.BotonSiguienteID);
    }
    static CrearPrevio() {
        return new Boton()
            .setLabel(Boton.BotonPrevioLabel)
            .setCustomId(Boton.BotonPrevioID);
    }
}
exports.default = Boton;
Boton.BotonSiguienteLabel = '→';
Boton.BotonPrevioLabel = '←';
Boton.BotonSiguienteID = 'botonSiguiente';
Boton.BotonPrevioID = 'botonPrevio';
