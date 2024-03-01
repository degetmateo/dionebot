export default class NoPermissionsException extends Error {
    constructor (message: string) {
        super(message);
        this.name = 'NoPermissionsException';
    }
}