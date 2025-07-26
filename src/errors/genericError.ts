export default class GenericError extends Error {
    constructor (message?: string) {
        super(message || 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
    };
};