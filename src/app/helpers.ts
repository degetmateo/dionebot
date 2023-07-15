const translate = require('translate');

export default class Helpers {
    private static readonly LENGUAJE_TRADUCCION: string = 'es';
    private static readonly REGEX_CADENA_SIN_HTML: RegExp = /(<([^>]+)>|&\w+;)/gi;

    public static async traducir (texto: string): Promise<string> {
        return await translate(texto, this.LENGUAJE_TRADUCCION);
    }

    public static async traducirElementosArreglo (elementos: Array<string>): Promise<Array<string>> {
        const elementosTraducidos = new Array<string>();

        for (let i = 0; i < elementos.length; i++) {
            try {
                elementosTraducidos.push(await this.traducir(elementos[i]));   
            } catch (error) {
                elementosTraducidos.push(elementos[i]);
                continue;
            }
        }
    
        return elementosTraducidos;
    }

    public static esNumero (args: string) {
        return !(isNaN(+args) || isNaN(parseFloat(args)));
    }

    public static eliminarEtiquetasHTML (cadena: string) {
        try {
            if (cadena.length <= 0) return '';
            return cadena.replace(this.REGEX_CADENA_SIN_HTML, '');
        } catch (error) {
            throw error;
        }
    }

    public static dividirArreglo <Tipo> (arr: Tipo[], num: number): Tipo[][] {
        const subArreglos: Tipo[][] = [];
      
        for (let i = 0; i < arr.length; i += num) {
            const subArreglo = arr.slice(i, i + num);
            subArreglos.push(subArreglo);
        }
      
        return subArreglos;
    }

    public static eliminarRepetidos <Tipo> (arr: Tipo[]): Tipo[] {
        return [...new Set(arr)];
    }

    public static eliminarObjetosRepetidos <Tipo> (arr: Tipo[]): Tipo[] {
        const set = new Set(arr.map(e => JSON.stringify(e)));
        return Array.from(set).map(e => JSON.parse(e));
    }
}