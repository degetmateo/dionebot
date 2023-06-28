const translate = require('translate');

const esNumero = (args: string) => {
    return !(isNaN(+args) || isNaN(parseFloat(args)));
}

const traducir = async (args: string) => {
    return await translate(args, "es");
}

export { esNumero, traducir };