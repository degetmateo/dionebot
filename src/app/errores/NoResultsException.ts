export default class NoResultsException extends Error {
    constructor (message: string) {
        super(message);
        this.name = 'NoResultsException';
    }
}