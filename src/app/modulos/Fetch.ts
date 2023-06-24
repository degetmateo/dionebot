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

        const data = await fetch(this.url, opciones);
        const res = await data.json();
        
        if (!res || !res.data) return null;

        return res.data;
    }
}

export { Fetch };