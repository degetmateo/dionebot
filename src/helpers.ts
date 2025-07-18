class Helpers {
    private static readonly STRING_WITHOUT_HTML: RegExp = /(<([^>]+)>|&\w+;)/gi;

    public static isNumber (args: string) {
        return !(isNaN(+args) || isNaN(parseFloat(args)));
    };

    public static clearHTML (text: string) {
        if (text.length <= 0) return '';
        return text.replace(this.STRING_WITHOUT_HTML, '');
    };

    public static deleteRepeatedElements <Tipo> (arr: Tipo[]): Tipo[] {
        const set = new Set(arr.map(e => JSON.stringify(e)));
        return Array.from(set).map(e => JSON.parse(e));
    };
};

export default Helpers;