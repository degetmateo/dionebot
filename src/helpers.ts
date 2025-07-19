export default class Helpers {
    public static readonly STRING_WITHOUT_HTML: RegExp = /(<([^>]+)>|&\w+;)/gi;

    public static isNumber (args: string) {
        return !(isNaN(+args) || isNaN(parseFloat(args)));
    };

    public static clearHTML (text: string) {
        if (text.length <= 0) return '';
        return text.replace(this.STRING_WITHOUT_HTML, '');
    };

    public static deleteRepeatedElements <T> (arr: T[]): T[] {
        const set = new Set(arr.map(e => JSON.stringify(e)));
        return Array.from(set).map(e => JSON.parse(e));
    };

    public static ponderedMean (count: number, mean: number, total: number): number {
        return ((count / (count + total)) * mean) + ((total / (count + total)) * 41);
    };

    public static capitalizeText (text: string): string {
        return text.split(' ').map(word => this.capitalizeWord(word)).join(' ');
    };

    public static capitalizeWord (word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };
};