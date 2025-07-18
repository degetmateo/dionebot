import GenericError from "../errors/genericError";
import { codes } from "./codes";

export default class Anilist {
    private static readonly URL: string = 'https://graphql.anilist.co';

    public static async query (query: string) {
        const request = await fetch(this.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ query })
        });

        const response = await request.json();
        
        if (!request.ok) {
            const error = codes[response.errors[0].status];

            if (error) throw new GenericError(error);
            else throw response.errors[0];
        };

        return response.data;
    };
};