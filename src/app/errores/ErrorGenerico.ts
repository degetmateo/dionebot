export default class ErrorGenerico extends Error {
    constructor (texto: string) {
        super(texto);
        this.name = 'ErrorGenerico';
    }
}