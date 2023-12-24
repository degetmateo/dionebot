"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorDemasiadasPeticiones extends Error {
    constructor(texto) {
        super(texto);
        this.name = 'ErrorDemasiadasPeticiones';
    }
}
exports.default = ErrorDemasiadasPeticiones;
