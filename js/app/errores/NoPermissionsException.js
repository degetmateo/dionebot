"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoPermissionsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoPermissionsException';
    }
}
exports.default = NoPermissionsException;
