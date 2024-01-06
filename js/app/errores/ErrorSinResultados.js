"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorSinResultados extends Error {
    constructor(texto) {
        super(texto);
        this.name = 'ErrorSinResultados';
    }
}
exports.default = ErrorSinResultados;
