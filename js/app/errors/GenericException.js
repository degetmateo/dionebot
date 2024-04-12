"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericException extends Error {
    constructor(message) {
        super(message);
        this.name = 'GenericException';
    }
}
exports.default = GenericException;
