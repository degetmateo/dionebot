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
};