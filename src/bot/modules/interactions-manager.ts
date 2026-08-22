export default class InteractionsManager {
    public interactions: Map<string, any>;
    public timeouts: Map<string, NodeJS.Timeout>;
    public lists: Map<string, Array<string>>;

    constructor () {    
        this.interactions = new Map<string, any>();
        this.timeouts = new Map<string, NodeJS.Timeout>();
        this.lists = new Map<string, Array<string>>();
    };

    has (key: string) {
        return this.interactions.has(key);
    };

    set (data: any, expiresIn?: number): string {
        const key = Date.now().toString(36);
        data.key = key;

        if (!this.lists.has(key)) {
            this.lists.set(key, [key]);
        } else {
            this.lists.get(key)?.push(key);
        };

        // if (!data.caches) data.caches = [];
        // data.caches.push(key);

        if (!this.timeouts.has(key)) {
            this.timeouts.set(key, setTimeout(() => {
                this.interactions.delete(key);
                this.lists.delete(key);
                this.timeouts.delete(key);
            }, expiresIn || 60_000));
        };

        // if (!data.timeout) {
        //     data.timeout = setTimeout(() => {
        //         this.interactions.delete(key);
        //     }, expiresIn || 60_000);
        // };

        this.interactions.set(key, data);
        return key;
    };

    update (key: string, data: any, expiresIn?: number) {
        if (expiresIn) {
            clearTimeout(this.timeouts.get(key));
            
            this.timeouts.set(key, setTimeout(() => {
                this.interactions.delete(key);
                this.lists.delete(key);
                this.timeouts.delete(key);
            }, expiresIn || 60_000));
        };

        if (!data.key) data.key = key;

        this.interactions.set(key, data);
    };

    get (key: string) {
        return this.interactions.get(key);
    };

    delete (key: string) {
        this.interactions.delete(key);
        this.timeouts.delete(key);
        this.lists.delete(key);
    };
};