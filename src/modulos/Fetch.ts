import fetch from "node-fetch";

class Fetch {
    public static async request(query: string, variables: any): Promise<any> {
        const url = 'https://graphql.anilist.co';
    
        const opciones = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            body: JSON.stringify({ query, variables })
        };

        const data = await fetch(url, opciones);
        const response = await data.json();

        if (!response || !response.data) return null;

        return response.data;
    }
}

export { Fetch };