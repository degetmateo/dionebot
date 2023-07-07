import Helpers from "../src/app/helpers";

describe('HELPERS', () => {
    describe('Helpers.esNumero', () => {
        test('cadena vacia test', () => {
            expect(Helpers.esNumero('')).toBeFalsy();
        })

        test('cadena caracteres no numericos test', () => {
            expect(Helpers.esNumero('test')).toBeFalsy();
        })
        
        test('cadena caracteres numericos y no numericos test', () => {
            expect(Helpers.esNumero('asd123')).toBeFalsy();
        })

        test('cadena caracteres numericos test', () => {
            expect(Helpers.esNumero('5')).toBeTruthy();
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

    describe('Helpers.traducir', () => {
        test('cadena vacia devuelve error test', async () => {
            await expect(Helpers.traducir('')).rejects.toThrowError('Translation not found');
        })

        test('palabra que no existe devuelve la misma palabra test', async () => {
            const PALABRA_INEXISTENTE = 'adjmfsdklfjmds';
            await expect(Helpers.traducir(PALABRA_INEXISTENTE)).resolves.toBe(PALABRA_INEXISTENTE);
        })

        test('1 palabra test', async () => {
            await expect(Helpers.traducir('Hello')).resolves.toBe('Hola');
        })
    })
})