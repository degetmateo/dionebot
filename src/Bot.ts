import fetch from "node-fetch";

import { Client, ClientEvents, Message } from "discord.js";
import { Anime } from "./Anime";
import { Manga } from "./Manga";

class BOT {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public on(event: keyof ClientEvents, func: any) {
        this.client.on(event, func);
    }

    public responder(message: Message, text: string) {
        message.reply(text);
    }

    public enviar(message: Message, text: string) {
        message.channel.send(text);
    }

    public async anime(name: String) {
        return await this.buscar("ANIME", name);
    }

    public async manga(name: String) {
        return await this.buscar("MANGA", name);
    }

    private async buscar(type: String, name: String) {
        const query = `
            query ($id: Int, $page: Int, $perPage: Int, $search: String) {
                Page (page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media (id: $id, type: ${type}, search: $search) {
                        id
                        title {
                            romaji
                        }
                    }
                }
            }
        `;

        // Define our query variables and values that will be used in the query request
        const variables = {
            search: name,
            page: 1,
            perPage: 1
        };

        // Define the config we'll need for our Api request
        const url = 'https://graphql.anilist.co';

        const opciones = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            body: JSON.stringify({ query, variables })
        };

        const response = await fetch(url, opciones);
        const meta = await response.json();

        return await this.cargar(type, meta.data.Page.media);
    }

    private async cargar(type: String, media: any): Promise<Anime | Manga> {
        const query = `
            query ($id: Int) { # Define which variables will be used in the query (id)
                Media (id: $id, type: ${type}) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                }
            }
        `;
        
        // Define our query variables and values that will be used in the query request
        var variables = {
            id: media[0].id
        };
        
        // Define the config we'll need for our Api request
        var url = 'https://graphql.anilist.co',
            opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };

        const response = await fetch(url, opciones);
        const req = await response.json();

        if (type == "ANIME") {
            return new Anime(req.data.Media.id, req.data.Media.title, req.data.Media.description);
        } else {
            return new Manga(req.data.Media.id, req.data.Media.title, req.data.Media.description);
        }
    }
}

export { BOT };