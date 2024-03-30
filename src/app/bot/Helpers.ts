const translate = require('translate');

export default class Helpers {
    private static readonly LENGUAJE_TRADUCCION: string = 'es';
    private static readonly REGEX_CADENA_SIN_HTML: RegExp = /(<([^>]+)>|&\w+;)/gi;
    private static readonly REGEX_OBTENER_ENLACES: RegExp = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

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

    public static isNumber (args: string) {
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

    public static eliminarElementosRepetidos <Tipo> (arr: Tipo[]): Tipo[] {
        const set = new Set(arr.map(e => JSON.stringify(e)));
        return Array.from(set).map(e => JSON.parse(e));
    }

    public static obtenerEnlaces (texto: string): Array<string> {
        const enlaces = texto.match(this.REGEX_OBTENER_ENLACES);
        return enlaces ? enlaces : [];
    }

    public static capitalizarTexto (texto: string): string {
        return texto.split(' ').map(p => this.capitalizarPalabra(p)).join(' ');
    }

    public static capitalizarPalabra (palabra: string): string {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }

    public static calcularPromedioPonderado (cantidad: number, promedio: number, total: number): number {
        return ((cantidad / (cantidad + total)) * promedio) + ((total / (cantidad + total)) * 41);
    }

    public static obtenerElementoAlAzar <T> (lista: T[]): T | undefined {
        if (lista.length === 0) {
          return undefined;
        }

        const indiceAleatorio = Math.floor(Math.random() * lista.length);
        return lista[indiceAleatorio];
    }

    public static getRandomElement <T> (elements: T[]): T | undefined {
        if (elements.length === 0) {
          return undefined;
        }

        const randomIndex = Math.floor(Math.random() * elements.length);
        return elements[randomIndex];
    }

    public static async asyncMap <T, U> (array: T[], asyncCallback: (element: T) => Promise<U>): Promise<U[]> {
        return await Promise.all(array.map(asyncCallback));
    }

    public static addElements (array: number[]): number {
        let sum = 0;

        for (const element of array) {
            sum += element;
        }

        return sum;
    }

    public static calculateAverage (array: number[]): number {
        return this.addElements(array) / array.length;
    }
}