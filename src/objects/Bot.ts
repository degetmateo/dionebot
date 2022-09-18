import fetch from "node-fetch";
import * as toHex from "colornames";
import { Client, ClientEvents, Message, EmbedBuilder, ColorResolvable, GuildMember, Embed } from "discord.js";
import { Obra } from "./Obra";
import { Usuario } from "./Usuario";
import { DB } from "../db";
import { AniUser } from "../models/AniUser";

import { Mensaje } from "./Mensaje";

class BOT {
    private client: Client;
    private db: DB;

    constructor(client: Client, db: DB) {
        this.client = client;
        this.db = db;
    }

    public iniciar() {
        this.on("ready", () => console.log("BOT preparado!"));
        
        this.on("messageCreate", async (message: Message) => {
            const mensaje = new Mensaje(message);
            const comando = mensaje.getComando();
            const args = mensaje.getArgumentos();
        
            if (comando === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            };
        
            if (comando == "!anime") {
                const anime = await this.anime(args[0]);
                if (!anime) return;
                this.enviarInfoMedia(message, anime);
            }
        
            if (comando == "!manga") {
                const manga = await this.manga(args[0]);
                if (!manga) return;
                this.enviarInfoMedia(message, manga);
            }
        
            if (comando == "!user") {
                let usuario;
        
                if (args[0] == "" || !args[0]) {
                    const userID = message.author.id.toString();
                    usuario = await this.usuario(userID, "id");
                } else {
                    usuario = await this.usuario(args[0], "username");
                }
                
                if (!usuario) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }
        
                this.enviarInfoUser(message, usuario);
            }
        
            if (comando == "!setup") {
                const result = await this.setup(args[0], message);
        
                if (result) {
                    message.react("✅");
                } else {
                    message.react("❌");
                }
            }
        
            if (comando == "!unsetup") {
                const result = await this.unsetup(message);
        
                if (result) {
                    message.react("✅");
                } else {
                    message.react("❌");
                }
            }
        
            if (comando == "!afinidad") {
                let resultado: boolean;

                if (!args[0]) {
                    resultado = await this.afinidad(message);
                } else {
                    resultado = false;
                }
        
                if (resultado) {
                    message.react("✅");
                } else {
                    message.react("❌");
                }
            }
        
            if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                this.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
            };
        
            if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                this.responder(message, "las de doce son goood");
            };
        
            if (message.content.endsWith("5") || message.content.endsWith("cinco")) {
                this.responder(message, "por el culo te la hinco");
            }
        
            if (message.content.endsWith("contexto")) {
                this.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
            }
        });
        
        this.db.conectar(process.env.DB);
        this.client.login(process.env.TOKEN);
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
            const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;

            const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Temporada**: ${obra.getTemporada()}\n‣ **Año de Emisión**: ${obra.getAnioEmision()}\n‣ **Episodios**: ${obra.getEpisodios()}
            `;

            EmbedInformacion
                .setColor(0xff0000)
                .addFields(
                    { name: "▽", value: infoTEXT_1, inline: true },
                    { name: "▽", value: infoTEXT_2, inline: true }
                    // { name: "Tipo", value: obra.getTipo(), inline: true },
                    // { name: "Formato", value: obra.getFormato(), inline: true },
                    // { name: "Estado", value: obra.getEstado(), inline: true },
                    // { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                    // { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                    // { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                    // { name: "Temporada", value: obra.getTemporada(), inline: true },
                    // { name: "Episodios", value: obra.getEpisodios(), inline: true },
                    // { name: "Duracion", value: obra.getDuracion(), inline: true }
                )
        } else {
            const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;

            const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Capítulos**: ${obra.getCapitulos()}\n‣ **Volúmenes**: ${obra.getVolumenes()}
            `;

            EmbedInformacion
                .setColor(0xFFFF00)
                .addFields(
                    { name: "▽", value: infoTEXT_1, inline: true },
                    { name: "▽", value: infoTEXT_2, inline: true }
                    // { name: "Tipo", value: obra.getTipo(), inline: true },
                    // { name: "Formato", value: obra.getFormato(), inline: true },
                    // { name: "Estado", value: obra.getEstado(), inline: true },
                    // { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                    // { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                    // { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                    // { name: "Temporada", value: obra.getTemporada(), inline: true },
                    // { name: "Capítulos", value: obra.getCapitulos(), inline: true },
                    // { name: "Volúmenes", value: obra.getVolumenes(), inline: true }
                )
        }

        let generosInfo = "";

        const generos = obra.getGeneros();

        for (let i = 0; i < generos.length; i++) {
            generosInfo += "`" + generos[i] + "` - "
        }

        generosInfo = generosInfo.substring(0, generosInfo.length - 3);

        if (!generosInfo || generosInfo.length < 0) generosInfo = "`Desconocidos`"

        EmbedInformacion
            .addFields(
                { name: "Géneros", value: generosInfo, inline: false }
            )

        const users = await DB.buscar(message.guild?.id.toString());
        const usuariosObra: any[] = [];

        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                const userListInfo = await this.buscarMedia(users[i].anilistId, obra.getID());

                if (userListInfo != null) {
                    userListInfo.username = users[i].anilistUsername;
                    userListInfo.discordId = users[i].discordId;
                    usuariosObra.push(userListInfo);
                }
            }

            const usuariosMapeados = [];

            for (let i = 0; i < usuariosObra.length; i++) {
                // const discordUser = message.guild?.members.cache.find(m => m.id == usuariosObra[i].discordId);

                if (parseFloat(usuariosObra[i].score.toString()) <= 10) {
                    usuariosObra[i].score = parseFloat((usuariosObra[i].score * 10).toString());
                }

                const u = {
                    name: usuariosObra[i].username,
                    status: usuariosObra[i].status,
                    progress: usuariosObra[i].progress,
                    score: parseFloat(usuariosObra[i].score.toString())
                }

                usuariosMapeados.push(u);
            }

            let completedTEXT = "";
            let inProgressTEXT = "";
            let droppedTEXT = "";
            let pausedListTEXT = "";
            let planningTEXT = "";

            for (let i = 0; i < usuariosMapeados.length; i++) {
                if (usuariosMapeados[i].status == "COMPLETED") {
                    completedTEXT += `${usuariosMapeados[i].name} **[${usuariosMapeados[i].score}]** - `;
                }

                if (usuariosMapeados[i].status == "DROPPED") {
                    droppedTEXT += `${usuariosMapeados[i].name} **(${usuariosMapeados[i].progress})** **[${usuariosMapeados[i].score}]** - `;
                }

                if (usuariosMapeados[i].status == "CURRENT") {
                    inProgressTEXT += `${usuariosMapeados[i].name} **(${usuariosMapeados[i].progress})** **[${usuariosMapeados[i].score}]** - `;
                }

                if (usuariosMapeados[i].status == "PAUSED") {
                    pausedListTEXT += `${usuariosMapeados[i].name} **[${usuariosMapeados[i].score}]** - `;
                }

                if (usuariosMapeados[i].status == "PLANNING") {
                    planningTEXT += `${usuariosMapeados[i].name} - `;
                }
            }

            if (completedTEXT.trim().endsWith("-")) {
                completedTEXT = completedTEXT.substring(0, completedTEXT.length - 2);
            }

            if (droppedTEXT.trim().endsWith("-")) {
                droppedTEXT = droppedTEXT.substring(0, droppedTEXT.length - 2);
            }

            if (inProgressTEXT.trim().endsWith("-")) {
                inProgressTEXT = inProgressTEXT.substring(0, inProgressTEXT.length - 2);
            }

            if (pausedListTEXT.trim().endsWith("-")) {
                pausedListTEXT = pausedListTEXT.substring(0, pausedListTEXT.length - 2);
            }

            if (planningTEXT.trim().endsWith("-")) {
                planningTEXT = planningTEXT.substring(0, planningTEXT.length - 2);
            }

            if (completedTEXT.trim() == "") {
                completedTEXT = "Nadie"
            }

            if (droppedTEXT.trim() == "") {
                droppedTEXT = "Nadie"
            }

            if (inProgressTEXT.trim() == "") {
                inProgressTEXT = "Nadie"
            }

            if (pausedListTEXT.trim() == "") {
                pausedListTEXT = "Nadie"
            }

            if (planningTEXT.trim() == "") {
                planningTEXT = "Nadie"
            }

            EmbedInformacion
                .addFields(
                    { name: "Terminados", value: completedTEXT, inline: false },
                    { name: "Dropeados", value: droppedTEXT, inline: false },
                    { name: "En Pausa", value: pausedListTEXT, inline: false },
                    { name: "En Progreso", value: inProgressTEXT, inline: false },
                    { name: "Planeados", value: planningTEXT, inline: false }
                )
        }

        console.log(usuariosObra);
        this.enviarEmbed(message, EmbedInformacion);
    }

    private async buscarMedia(userID: any, mediaID: any) {
        const id = parseInt(userID);
        const mediaId = parseInt(mediaID);
        const query = `
            query ($id: Int, $mediaId: Int) {
                MediaList(userId: $id, mediaId: $mediaId) {
                    id
                    mediaId
                    status
                    score
                    progress
                }
            }`;

        const variables = {
            id: id,
            mediaId: mediaId
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
        return req.data.MediaList;
    }

    private async buscarLista(username: string | undefined) {
        const query = `
            query ($username: String) {
                animeList: MediaListCollection(userName: $username, type: ANIME) {
                    user {
                        name
                        avatar {
                            large
                        }
                        options {
                            profileColor
                        }
                        siteUrl
                    }
                    lists {
                        entries {
                            mediaId,
                            score(format: POINT_100)
                        }
                    }
                }
                mangaList: MediaListCollection(userName: $username, type: MANGA) {
                    lists {
                        entries {
                            mediaId,
                            score(format: POINT_100)
                        }
                    }
                }
            }`;

        const variables = {
            username: username
        }

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

        return req;
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

    public async usuario(criterio: any, tipo: string) {
        if (tipo == "username") {
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
                name: criterio
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
    
            return new Usuario(req.data.User);
        } else {
            const u = await AniUser.findOne({ discordId: criterio });

            if (u == null || u == undefined) return null;

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
                name: u.anilistUsername
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
    
            return new Usuario(req.data.User);
        }
    }

    public async enviarInfoUser(message: Message, user: any) {
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
                    value: `‣ Vistos: ${stats.anime.count}\n‣ Nota Promedio: ${stats.anime.meanScore}\n‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}\n‣ Episodios Totales: ${stats.anime.episodesWatched}`,
                    inline: false
                },
                { 
                    name: "Mangas",
                    value: `‣ Leídos: ${stats.manga.count}\n‣ Nota Promedio: ${stats.manga.meanScore}\n‣ Capítulos Leídos: ${stats.manga.chaptersRead}\n‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
                    inline: false
                },
            )

        this.enviarEmbed(message, EmbedInformacion);
    }

    public async setup(username: string, message: Message): Promise<boolean> {
        const usuario = await this.usuario(username, "username");
        
        if (!usuario) return false;

        let svUsers = await AniUser.find({ serverId: message.guildId });
        let dbUser = svUsers.find(u => u.discordId == message.author.id);

        if (dbUser != null && dbUser != undefined) return false;

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

    public async unsetup(message: Message): Promise<boolean> {
        const svUsers = await AniUser.find({ serverId: message.guildId });
        const result = svUsers.find(u => u.discordId == message.author.id);

        try {
            result?.delete();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    private async calcularAfinidad(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
        let afinidad = 0;

        const cantidadAnimes = l1.length;

        for (let i = 0; i < l1.length; i++) {
            const l1MediaId = l1[i].mediaId;
            const l1MediaScore = l1[i].score;

            const sharedMedia = l2.find(e => e.mediaId == l1MediaId);

            if (!sharedMedia) continue;
            if (sharedMedia.score == l1MediaScore) afinidad++;
        }

        console.log(cantidadAnimes)
        console.log(afinidad)

        afinidad = parseFloat(((afinidad * 100) / cantidadAnimes).toFixed(2));

        return afinidad;
    }

    public async afinidad(message: Message): Promise<boolean> {
        const userID = message.author.id;
        const serverID = message.guildId;

        const usuariosRegistrados = await AniUser.find({ serverId: serverID });
        const usuario = usuariosRegistrados.find(u => u.discordId == userID);

        const aniuser1 = await this.usuario(usuario?.anilistUsername, "username");
        const userList1 = await this.buscarLista(aniuser1?.getNombre());
        const user1AnimeList = userList1.data.animeList.lists[0].entries;

        let afinidades = [];

        let i = 0;
        while (i < usuariosRegistrados.length) {
            if (usuariosRegistrados[i].anilistUsername == usuario?.anilistUsername) {
                i++;
                continue;
            }

            const aniuser2 = await this.usuario(usuariosRegistrados[i].anilistUsername, "username");
            const userList2 = await this.buscarLista(aniuser2?.getNombre());
            const user2AnimeList = userList2.data.animeList.lists[0].entries;

            const resultado = await this.calcularAfinidad(user1AnimeList, user2AnimeList);

            afinidades.push({ username: aniuser2?.getNombre(), afinidad: resultado });

            i++;
        }

        afinidades = afinidades.sort((a, b) => {
            if (a.afinidad < b.afinidad) {
                return 1;
            }

            if (a.afinidad > b.afinidad) {
                return -1;
            }

            return 0;
        });

        let textoAfinidad = "";

        for (let i = 0; i < afinidades.length && i < 10; i++) {
            textoAfinidad += `▹ ${afinidades[i].username} - **${afinidades[i].afinidad}%**\n`;
        }

        const hexColor = toHex.get(aniuser1 == null ? "black" : aniuser1.getColorName()).value;
        const color = "0x" + hexColor;

        const EmbedAfinidad = new EmbedBuilder()
            .setTitle("Afinidad de " + aniuser1?.getNombre())
            .setThumbnail(aniuser1 == null ? null : aniuser1.getAvatarURL())
            .setDescription(textoAfinidad)
            .setColor(color as ColorResolvable)

        this.enviarEmbed(message, EmbedAfinidad);

        return true;
    }
}

export { BOT };