import fetch from "node-fetch";

import { Client, ClientEvents, Message, EmbedBuilder, Embed } from "discord.js";
import { Obra } from "./Obra";

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

    public enviarEmbed(message: Message, embed: EmbedBuilder) {
        message.channel.send({ embeds: [embed] });
    }

    public enviarInfo(message: Message, obra: Obra): void {
        const EmbedInformacion = new EmbedBuilder()
            .setTitle(obra.getTitulos().native)
            .setURL(obra.getURL())
            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription(obra.getDescripcion())
            .setThumbnail(obra.getCoverImageURL())
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            // .setImage('https://i.imgur.com/AfFp7pu.png')
            // .setTimestamp()
            .setFooter({ text: obra.getTitulos().romaji + " | " + obra.getTitulos().english });

        if (obra.getTipo() == "ANIME") {
            EmbedInformacion
                .setColor(0xff0000)
                .addFields(
                    { name: "Tipo", value: obra.getTipo(), inline: true },
                    { name: "Formato", value: obra.getFormato(), inline: true },
                    { name: "Estado", value: obra.getEstado(), inline: true },
                    { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                    { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                    { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                    { name: "Temporada", value: obra.getTemporada(), inline: true },
                    { name: "Episodios", value: obra.getEpisodios(), inline: true },
                    { name: "Duracion", value: obra.getDuracion(), inline: true }
                )
        } else {
            EmbedInformacion
                .setColor(0xFFFF00)
                .addFields(
                    { name: "Tipo", value: obra.getTipo(), inline: true },
                    { name: "Formato", value: obra.getFormato(), inline: true },
                    { name: "Estado", value: obra.getEstado(), inline: true },
                    { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                    { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                    { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                    { name: "Temporada", value: obra.getTemporada(), inline: true },
                    { name: "Capítulos", value: obra.getCapitulos(), inline: true },
                    { name: "Volúmenes", value: obra.getVolumenes(), inline: true }
                )
        }

        this.enviarEmbed(message, EmbedInformacion);
    }

    public async anime(name: String) {
        return await this.buscar("ANIME", name);
    }

    public async manga(name: String) {
        return await this.buscar("MANGA", name);
    }

    private async buscar(tipo: String, nombre: String) {
        const query = `
        query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (search: $search, type: $type) {
                    id
                    idMal
                    title {
                        english
                        romaji
                        native
                    }
                    type
                    format
                    status
                    description
                    season
                    seasonYear
                    episodes
                    duration
                    chapters
                    volumes
                    coverImage {
                        extraLarge
                    }
                    genres
                    synonyms
                    meanScore
                    popularity
                    favourites
                    siteUrl
                }
            }
        }
        `;

        // Define our query variables and values that will be used in the query request
        const variables = {
            search: nombre,
            type: tipo.toUpperCase(),
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

        return await this.cargar(tipo, meta.data.Page.media[0].id);
    }

    private async cargar(tipo: String, id: String): Promise<Obra | null> {
        if (!id) return null;

        const query = `
            query ($id: Int) { # Define which variables will be used in the query (id)
                Media (id: $id, type: ${tipo}) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                    id
                    idMal
                    title {
                        english
                        romaji
                        native
                    }
                    type
                    format
                    status
                    description
                    season
                    seasonYear
                    episodes
                    duration
                    chapters
                    volumes
                    coverImage {
                        extraLarge
                    }
                    genres
                    synonyms
                    meanScore
                    popularity
                    favourites
                    siteUrl
                }
            }
        `;
        
        // Define our query variables and values that will be used in the query request
        const variables = {
            id: id
        };
        
        // Define the config we'll need for our Api request
        const url = 'https://graphql.anilist.co';

        const opciones = {
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

        console.log(req.data.Media);

        if (!req.data.Media) return null;

        return new Obra(req.data.Media);
    }
}

export { BOT };