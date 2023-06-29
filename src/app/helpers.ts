const translate = require('translate');

const esNumero = (args: string) => {
    return !(isNaN(+args) || isNaN(parseFloat(args)));
}

const traducir = async (args: string) => {
    return await translate(args, "es");
}

const traducirElementosArreglo = async (elementos: Array<string>): Promise<Array<string>> => {
    const elementosTraducidos = new Array<string>();

    for (let i = 0; i < elementos.length; i++) {
        try {
            elementosTraducidos.push(await traducir(elementos[i]));   
        } catch (error) {
            elementosTraducidos.push(elementos[i]);
            continue;
        }
    }

    return elementosTraducidos;
}

const getStringSinHTML = (stringHTML: string): string => {
    const regex = /(<([^>]+)>|&\w+;)/gi;
    return stringHTML.replace(regex, '');
}

export { esNumero, traducir, getStringSinHTML, traducirElementosArreglo };