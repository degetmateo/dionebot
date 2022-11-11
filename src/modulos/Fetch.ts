import fetch from "node-fetch";

class Fetch {
    private static url: string = "https://graphql.anilist.co";

    public static async request<T> (query: string, variables: any): Promise<T> {
        const opciones = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            
            body: JSON.stringify({ query, variables })
        };

        const res = await fetch(this.url, opciones);

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return await res.json() as Promise<T>;
    }
}

export { Fetch };