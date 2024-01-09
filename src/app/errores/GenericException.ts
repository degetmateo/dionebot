export default class GenericException extends Error {
    constructor (message: string) {
        super(message);
        this.name = 'GenericException';
    }
}