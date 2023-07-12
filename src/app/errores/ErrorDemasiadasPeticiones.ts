export default class ErrorDemasiadasPeticiones extends Error {
    constructor (texto: string) {
        super(texto);
        this.name = 'ErrorDemasiadasPeticiones';
    }
}