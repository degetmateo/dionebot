"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TooManyRequestsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooManyRequestsException';
    }
}
exports.default = TooManyRequestsException;
