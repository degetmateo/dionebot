export default class ErrorSinResultados extends Error {
    constructor (texto: string) {
        super(texto);
        this.name = 'ErrorSinResultados';
    }
}