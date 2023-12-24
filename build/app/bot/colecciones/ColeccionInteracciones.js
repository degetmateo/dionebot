"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColeccionInteracciones {
    constructor(interacciones) {
        this.interacciones = interacciones;
    }
    static CrearNueva() {
        return new ColeccionInteracciones(new Set());
    }
    vaciar() {
        this.interacciones = new Set();
    }
    existe(interaccion) {
        return this.interacciones.has(interaccion);
    }
    agregar(interaccion) {
        this.interacciones.add(interaccion);
    }
    eliminar(interaccion) {
        this.interacciones.delete(interaccion);
    }
}
exports.default = ColeccionInteracciones;
