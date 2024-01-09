"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoResultsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoResultsException';
    }
}
exports.default = NoResultsException;
