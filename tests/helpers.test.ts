import Helpers from "../src/app/Helpers";

describe('HELPERS', () => {
    describe('Helpers.esNumero', () => {
        test('cadena vacia test', () => {
            expect(Helpers.esNumero('')).toBe(false);
        })

        test('cadena caracteres no numericos test', () => {
            expect(Helpers.esNumero('test')).toBe(false);
        })
        
        test('cadena caracteres numericos y no numericos test', () => {
            expect(Helpers.esNumero('asd123')).toBe(false);
        })

        test('cadena caracteres numericos test', () => {
            expect(Helpers.esNumero('5')).toBe(true);
        })
    })

    describe('Helpers.eliminarEtiquetasHTML', () => {
        test('cadena vacia test', () => {
            expect(Helpers.eliminarEtiquetasHTML('')).toBe('');
        })

        test('elemento html test', () => {
            expect(Helpers.eliminarEtiquetasHTML('</a>')).toBe('');
        })

        test('elemento html test 2', () => {
            expect(Helpers.eliminarEtiquetasHTML('<body>')).toBe('');
        })

        test('elemento html test 3', () => {
            expect(Helpers.eliminarEtiquetasHTML('<b>hola</b>')).toBe('hola');
        })

        test('elemento html en medio test', () => {
            expect(Helpers.eliminarEtiquetasHTML('ho<hr>la')).toBe('hola');
        })
    })
})