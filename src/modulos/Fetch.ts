import fetch from "node-fetch";

class Fetch {
    private static url: string = "https://graphql.anilist.co";

    public static async request(query: string, variables: any): Promise<any> {
        const opciones = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            
            body: JSON.stringify({ query, variables })
        };

        const res = await (await fetch(this.url, opciones)).json();
        const data = res.data;
        return data;
    }
}

export { Fetch };