export default class CommandUnderMaintenanceException extends Error {
    constructor (message: string) {
        super(message);
        this.name = 'CommandUnderMaintenanceException';
    }
}