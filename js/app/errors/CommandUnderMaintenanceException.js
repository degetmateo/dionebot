"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandUnderMaintenanceException extends Error {
    constructor(message) {
        super(message);
        this.name = 'CommandUnderMaintenanceException';
    }
}
exports.default = CommandUnderMaintenanceException;
