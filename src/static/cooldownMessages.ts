export default (locale: string, seconds: any) => {
    const condition = parseInt(seconds) <= 1;
    
    const locales: any = {
        "en-US": condition ? 
            `You will be able to use this command again \`in 1 second.\`` :
            `You will be able to use this command again \`in ${seconds} seconds.\``,
        "en-GB": condition ? 
            `You will be able to use this command again \`in 1 second.\`` :
            `You will be able to use this command again \`in ${seconds} seconds.\``,
        "es-ES": condition ? 
            `Podrás volver a utilizar este comando \`en 1 segundo.\`` :
            `Podrás volver a utilizar este comando \`en ${seconds} segundos.\``,
        "es-419": condition ? 
            `Podrás volver a utilizar este comando \`en 1 segundo.\`` :
            `Podrás volver a utilizar este comando \`en ${seconds} segundos.\``
    };

    return locales[locale] ?? locales['en-US'];
};