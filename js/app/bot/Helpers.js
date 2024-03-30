"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translate = require('translate');
class Helpers {
    static async traducir(texto) {
        return await translate(texto, this.LENGUAJE_TRADUCCION);
    }
    static async traducirElementosArreglo(elementos) {
        const elementosTraducidos = new Array();
        for (let i = 0; i < elementos.length; i++) {
            try {
                elementosTraducidos.push(await this.traducir(elementos[i]));
            }
            catch (error) {
                elementosTraducidos.push(elementos[i]);
                continue;
            }
        }
        return elementosTraducidos;
    }
    static isNumber(args) {
        return !(isNaN(+args) || isNaN(parseFloat(args)));
    }
    static eliminarEtiquetasHTML(cadena) {
        try {
            if (cadena.length <= 0)
                return '';
            return cadena.replace(this.REGEX_CADENA_SIN_HTML, '');
        }
        catch (error) {
            throw error;
        }
    }
    static dividirArreglo(arr, num) {
        const subArreglos = [];
        for (let i = 0; i < arr.length; i += num) {
            const subArreglo = arr.slice(i, i + num);
            subArreglos.push(subArreglo);
        }
        return subArreglos;
    }
    static eliminarElementosRepetidos(arr) {
        const set = new Set(arr.map(e => JSON.stringify(e)));
        return Array.from(set).map(e => JSON.parse(e));
    }
    static obtenerEnlaces(texto) {
        const enlaces = texto.match(this.REGEX_OBTENER_ENLACES);
        return enlaces ? enlaces : [];
    }
    static capitalizarTexto(texto) {
        return texto.split(' ').map(p => this.capitalizarPalabra(p)).join(' ');
    }
    static capitalizarPalabra(palabra) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }
    static calcularPromedioPonderado(cantidad, promedio, total) {
        return ((cantidad / (cantidad + total)) * promedio) + ((total / (cantidad + total)) * 41);
    }
    static obtenerElementoAlAzar(lista) {
        if (lista.length === 0) {
            return undefined;
        }
        const indiceAleatorio = Math.floor(Math.random() * lista.length);
        return lista[indiceAleatorio];
    }
    static getRandomElement(elements) {
        if (elements.length === 0) {
            return undefined;
        }
        const randomIndex = Math.floor(Math.random() * elements.length);
        return elements[randomIndex];
    }
    static async asyncMap(array, asyncCallback) {
        return await Promise.all(array.map(asyncCallback));
    }
    static addElements(array) {
        let sum = 0;
        for (const element of array) {
            sum += element;
        }
        return sum;
    }
    static calculateAverage(array) {
        return this.addElements(array) / array.length;
    }
}
exports.default = Helpers;
Helpers.LENGUAJE_TRADUCCION = 'es';
Helpers.REGEX_CADENA_SIN_HTML = /(<([^>]+)>|&\w+;)/gi;
Helpers.REGEX_OBTENER_ENLACES = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
