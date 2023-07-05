export default class ErrorArgumentoInvalido extends Error {
    constructor (texto: string) {
        super(texto);
        this.name = 'ErrorArgumentoInvalido';
    }
}