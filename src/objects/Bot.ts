import fetch from "node-fetch";

import { Client, ClientEvents, Message, EmbedBuilder, ColorResolvable } from "discord.js";
import * as toHex from "colornames";
import { Obra } from "./Obra";
import { Usuario } from "./Usuario";
import { AniUser } from "../models/AniUser";
import { DB } from "../db";

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

    public async enviarInfoMedia(message: Message, obra: Obra) {
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

        const users = await DB.buscar(message.guild?.id.toString());
        const usuariosObra = [];
        
        // for (let i = 0; i < users.length; i++) {

        // }

        await this.buscarLista(users[0].anilistId, obra.getID());

        this.enviarEmbed(message, EmbedInformacion);
    }

    private async buscarLista(userID: any, mediaID: any) {
        const id = parseInt(userID);
        const mediaId = parseInt(mediaID);
        const query = `
            query ($id: Int, $mediaId: Int) {
                MediaList(userId: $id, mediaId: $mediaId) {
                    id
                    media {
                        id
                    }
                }
            }`;

        const variables = {
            id: id,
            mediaId: mediaID
        };

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

        console.log("LISTA LISTA LISTA")
        console.log(id);
        if (!req.data) return null;
        console.log(req.data);
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

    public async usuario(username: string) {
        const query = `
        query ($name: String) {
            User(name: $name) {
                name
                id
                about
                avatar {
                    large
                    medium
                }
                bannerImage
                options {
                    profileColor
                }
                statistics {
                    anime {
                        count
                        meanScore
                        standardDeviation
                        minutesWatched
                        episodesWatched
                        formats {
                            count
                            format
                        }
                        statuses {
                            count
                            status
                        }
                        releaseYears {
                            count
                            releaseYear
                        }
                        startYears {
                            count
                            startYear
                        }
                        genres {
                            count
                            genre
                            meanScore
                            minutesWatched
                        }
                    }
                    manga {
                        count
                        meanScore
                        standardDeviation
                        chaptersRead
                        volumesRead
                        statuses {
                            count
                            status
                        }
                        releaseYears {
                            count
                            releaseYear
                        }
                        startYears {
                            count
                            startYear
                        }
                        genres {
                            count
                            genre
                            meanScore
                            chaptersRead
                        }
                    }
                }
                siteUrl
                updatedAt
            }
        }`;

        const variables = {
            name: username
        };


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

        if (!req.data.User) return null;

        console.log(req.data.User)
        console.log(req.data.User.statistics)

        return new Usuario(req.data.User);
    }

    public async enviarInfoUser(message: Message, user: Usuario) {
        const hexColor = toHex.get(user.getColorName()).value;
        const color = "0x" + hexColor;

        const stats = user.getEstadisticas();

        const EmbedInformacion = new EmbedBuilder()
            .setTitle(user.getNombre())
            .setURL(user.getURL())
            .setColor(color as ColorResolvable)
            .setThumbnail(user.getAvatarURL())
            .setImage(user.getBannerImage())
            .setDescription(user.getBio())
            .addFields(
                { 
                    name: "Animes",
                    value: `‣ Vistos: ${stats.anime.count}
                            ‣ Nota Promedio: ${stats.anime.meanScore}
                            ‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}
                            ‣ Episodios Totales: ${stats.anime.episodesWatched}`,
                    inline: false
                },
                { 
                    name: "Mangas",
                    value: `‣ Leídos: ${stats.manga.count}
                            ‣ Nota Promedio: ${stats.manga.meanScore}
                            ‣ Capítulos Leídos: ${stats.manga.chaptersRead}
                            ‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
                    inline: false
                },
            )

        this.enviarEmbed(message, EmbedInformacion);
    }

    public async setup(username: string, message: Message): Promise<boolean> {
        const usuario = await this.usuario(username);
        
        if (!usuario) return false;

        const aniuser = new AniUser();
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = message.author.id;
        aniuser.serverId = message.guild?.id;

        aniuser.save((err) => {
            console.error(err);
            return false;
        });

        return true;
    }
}

export { BOT };