import { RGBTuple } from "discord.js";

export default class Helpers {
    public static readonly STRING_WITHOUT_HTML: RegExp = /(<([^>]+)>|&\w+;)/gi;

    public static isNumber (args: string) {
        return !(isNaN(+args) || isNaN(parseFloat(args)));
    };

    public static clearHTML (text: string) {
        if (!text) return '';
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

    public static pearson (
        a: Array<{ mediaId: number; score: number }>, 
        b: Array<{ mediaId: number; score: number }>
    ): number {
        const mapB = new Map(b.map(m => [m.mediaId, m.score]));

        const common: Array<[number, number]> = [];

        for (const entry of a) {
            const bScore = mapB.get(entry.mediaId);
            
            if (bScore != null) {
                common.push([entry.score, bScore]);
            };
        };

        const n = common.length;
        if (n === 0) return 0;

        const sumA = common.reduce((sum, [a]) => sum + a, 0);
        const sumB = common.reduce((sum, [, b]) => sum + b, 0);
        const meanA = sumA / n;
        const meanB = sumB / n;

        let num = 0;
        let denA = 0;
        let denB = 0;

        for (const [a, b] of common) {
            num += (a - meanA) * (b - meanB);
            denA += (a - meanA) ** 2;
            denB += (b - meanB) ** 2;
        };

        if (denA === 0 || denB === 0) return 0;

        return (num / Math.sqrt(denA * denB)) * 100;
    };

    public static getRandomElement <T> (arr: T[]): T | undefined {
        if (arr.length === 0) return undefined;
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    };

    public static getRandomRGBTuple (): RGBTuple {
        const R = Math.floor(Math.random() * 256);
        const G = Math.floor(Math.random() * 256);
        const B = Math.floor(Math.random() * 256);
        return [R, G, B];
    };

    public static hasPassedMoreThanAMonth (a: Date, b: Date): boolean {
        const start = new Date(a);
        const end = new Date(b);

        if (end <= start) {
            return false;
        };

        const limit = new Date(start);

        limit.setMonth(limit.getMonth() + 1);

        return end > limit;
    };

    public static hexToRgb (hex: string): RGBTuple {
        hex = hex.replace(/^#/, '');

        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        };

        const R = parseInt(hex.substring(0, 2), 16);
        const G = parseInt(hex.substring(2, 4), 16);
        const B = parseInt(hex.substring(4, 6), 16);

        if (isNaN(R) || isNaN(G) || isNaN(B)) {
            return [0, 0, 0] as RGBTuple;
        };

        return [R, G, B] as RGBTuple; 
    };
};