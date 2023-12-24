"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorGenerico extends Error {
    constructor(texto) {
        super(texto);
        this.name = 'ErrorGenerico';
    }
}
exports.default = ErrorGenerico;
