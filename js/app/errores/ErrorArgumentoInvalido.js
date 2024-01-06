"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorArgumentoInvalido extends Error {
    constructor(texto) {
        super(texto);
        this.name = 'ErrorArgumentoInvalido';
    }
}
exports.default = ErrorArgumentoInvalido;
