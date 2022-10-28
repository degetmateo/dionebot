import { Client, GatewayIntentBits, ClientEvents, Message, EmbedBuilder, GuildMember, ChannelType, ColorResolvable, MessageActivityType } from "discord.js";

import { Obra } from "../modelos/Obra";
import { Usuario } from "../modelos/Usuario";
import { DB } from "./Database";
import { User } from "../modelos_db/User";
import { Mensaje } from "../modelos/Mensaje";

import { Media } from "../modulos/Media";
import { Usuarios } from "../modulos/Usuarios";
import { Afinidad } from "../modulos/Afinidad";
import { Setup } from "../modulos/Setup";
import { Embeds } from "../modulos/Embeds";

class BOT {
    private client: Client;
    private db: DB;
    private buscando_afinidad: boolean;

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });

        this.db = new DB();
        this.buscando_afinidad = false;
    }

    public async iniciar() {
        this.on("ready", () => console.log("BOT preparado!"));

        this.on("guildMemberAdd", (member: GuildMember) => {
            console.log("miembro nuevo");
            if (member.user.id == "301769610678632448") {
                console.log("dione existe");
                const role = member.guild.roles.cache.find(r => r.id == "1028895305938243585");
                if (!role) return
                console.log("rol existe");
                member.roles.add(role, "es dione");
            }
        })

        this.on("messageCreate", async (message: Message) => {
            if (!message) return;
            if (message.author.bot) return;
            if (!message.guild) return;

            const mensaje = new Mensaje(message);
            const comando = mensaje.getComando();
            const args = mensaje.getArgumentos();
        
            if (comando === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            };
        
            if (comando === "!color") {
                return this.setColor2(message, args[0]);
            }

            if (comando === "!ruleta") {
                const number = Math.floor(Math.random() * 6);

                if (number === 1) {        
                    // const c = message.guild.invites.

                    const channel = await message.channel.fetch();
                    const invite = channel.type === ChannelType.GuildText ? await channel.createInvite() : null;

                    invite ? await message.member?.user.send(invite.url) : null;

                    message.member?.kick();
                    message.channel.send(`${message.member?.user.username} fue expulsado...`)
                } else {
                    message.channel.send("...");
                }
            }

            // if (comando === "!shoot" && message.member?.permissions.has("Administrator")) {
            //     const ruleta = Math.floor(Math.random() * 6);

            //     if (true) {                    
            //         const cantMiembros = message.guild.members.cache.size;
            //         const number = Math.floor(Math.random() * cantMiembros - 1);
            //         // const miembro = message.guild.members
            //         const miembro = message.guild.members.cache.random();

            //         miembro?.kick();
            //         message.channel.send(`**${miembro?.user.username}** fue expulsado.`);
            //     } else {
            //         message.channel.send("...");
            //     }
            // }

            if (comando == "!anime") {
                const anime = await this.anime(args.join(" "));

                if (!anime) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }

                const embedInformacion = await Embeds.EmbedInformacionMedia(message, anime, false);
                this.enviarEmbed(message, embedInformacion);
            }

            if (comando == "!animeb") {
                const anime = await this.anime(args.join(" "));

                if (!anime) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }

                const embedInformacion = await Embeds.EmbedInformacionMedia(message, anime, true);
                this.enviarEmbed(message, embedInformacion);
            }
        
            if (comando == "!manga") {
                const manga = await this.manga(args.join(" "));
                
                if (!manga) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }

                const embedInformacion = await Embeds.EmbedInformacionMedia(message, manga, false);
                this.enviarEmbed(message, embedInformacion);
            }
        
            if (comando == "!mangab") {
                const manga = await this.manga(args.join(" "));
                
                if (!manga) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }

                const embedInformacion = await Embeds.EmbedInformacionMedia(message, manga, true);
                this.enviarEmbed(message, embedInformacion);
            }

            if (comando == "!user") {
                let usuario: Usuario | null;

                if (!args[0] || args[0].length <= 0) {
                    usuario = await this.usuario(message.guild.id, message.author.id);
                } else {
                    const usuarioMencionado = message.mentions.members?.first();
                    
                    if (usuarioMencionado) {
                        usuario = await this.usuario(message.guild.id, usuarioMencionado.id);
                    } else {
                        usuario = await this.usuario(message.guild.id, args[0]);
                    }
                }
                
                if (!usuario) {
                    return message.react("❌");
                } else {
                    message.react("✅");
                }
        
                const embed = Embeds.EmbedInformacionUsuario(usuario);
                this.enviarEmbed(message, embed);
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
                this.afinidad(message, args);
            }

            if (comando == "!help") {
                this.enviarEmbed(message, Embeds.EmbedInformacionHelp());
            }
        
            const mContent = message.content.toLowerCase()
                .split("é").join("e");

            if (mContent.endsWith(" que") || mContent.endsWith(" que?")) {
                return this.responder(message, "so");
            }

            if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                this.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
            };
        
            if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                this.responder(message, "las de doce son goood");
            };
        
            if (message.content.endsWith(" 5") || message.content.endsWith("cinco")) {
                this.responder(message, "por el culo te la hinco");
            }
        
            if (message.content.endsWith("contexto")) {
                this.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
            }
        });
        
        this.db.conectar(process.env.DB);
        this.client.login(process.env.TOKEN);
    }

    private on(event: keyof ClientEvents, func: any) {
        this.client.on(event, func);
    }

    private responder(message: Message, text: string) {
        message.reply(text);
    }

    private enviar(message: Message, text: string) {
        message.channel.send(text);
    }

    private enviarEmbed(message: Message, embed: EmbedBuilder) {
        message.channel.send({ embeds: [embed] });
    }

    private setColor2 = async (message: Message, colorCode: string) => {
        if (!colorCode || colorCode.trim() == "" || colorCode.trim().length <= 0) return message.react("❌");

        const colorRoleCode = "0x" + (colorCode.split("#").join(""));
        const color = colorRoleCode as ColorResolvable;

        if (!color) return message.react("❌");

        const memberColorRole = message.member?.roles.cache.find(r => r.name === message.member?.user.username);

        if (!memberColorRole) {
            const guildColorRole = message.guild?.roles.cache.find(r => r.name === message.member?.user.username);

            if (!guildColorRole) {
                const newRole = await message.guild?.roles.create({
                    name: message.member?.user.username,
                    color: color
                });

                if (!newRole) return message.react("❌");

                message.member?.roles.add(newRole);
            } else {
                guildColorRole.setColor(color);
                message.member?.roles.add(guildColorRole);
            }
        } else {
            const newMemberRole = await memberColorRole.setColor(color);
            if (!newMemberRole) return message.react("❌");
        }

        return message.react("✅");
    }

    private async anime(args: string) {
        return await this.buscarMedia("ANIME", args);
    }

    private async manga(args: string) {
        return await this.buscarMedia("MANGA", args);
    }

    private async buscarMedia(tipo: string, args: string) {
        if (isNaN(+args) || isNaN(parseFloat(args))) {
            const media = await Media.BuscarMedia(tipo, args);
            return media == null ? null : new Obra(media);
        } else {
            const media = await Media.BuscarMediaID(tipo, args);
            return media == null ? null : new Obra(media);
        }
    }

    public async buscarMediaUsuario(userID: string | undefined, mediaID: string) {
        return await Usuarios.GetStatsMedia(userID, mediaID);
    }

    public async usuario(serverID: string, args: string): Promise<Usuario | null> {
        const user = await Usuarios.BuscarUsuario(serverID, args);
        return user == null ? null : new Usuario(user);
    }

    private async setup(username: string, message: Message): Promise<boolean> {
        return await Setup.SetupUsuario(username, message);
    }

    private async unsetup(message: Message): Promise<boolean> {
        return await Setup.UnsetupUsuario(message);
    }

    private afinidad = async (message: Message, args: Array<string>) => {
        if (this.buscando_afinidad) {
            message.react("❌");
            message.reply("Estoy calculando la afinidad de alguien más...");
            return;
        }

        this.buscando_afinidad = true;

        const serverID = message.guild?.id;
        if (!serverID) {
            this.buscando_afinidad = false; 
            return message.react("❌");
        }

        let userID: string;

        if (!args[0]) {
            userID = message.author.id;
        }

        else if (message.mentions.members?.first()) {
            const uMencionado = message.mentions.members?.first();
            if (!uMencionado) {
                this.buscando_afinidad = false; 
                return message.react("❌");
            }
            userID = uMencionado.id;
        }

        else {
            const username = args[0];
            const user = await User.findOne({ anilistUsername: username });
            if (!user) {
                this.buscando_afinidad = false; 
                return message.react("❌");
            }
            if (!user?.discordId) {
                this.buscando_afinidad = false; 
                return message.react("❌");
            }
            userID = user.discordId;
        }

        const uRegistrados = await User.find({ serverId: serverID });
        const usuario = uRegistrados.find(u => u.discordId == userID);

        if (!usuario) {
            this.buscando_afinidad = false; 
            return message.react("❌");
        }
        if (!usuario.anilistUsername) {
            this.buscando_afinidad = false; 
            return message.react("❌");
        }

        message.channel.sendTyping();

        const aniuser1 = await this.usuario(serverID, usuario.anilistUsername);
        if (!aniuser1) {
            this.buscando_afinidad = false; 
            return message.react("❌");
        }

        const resultado: { error: boolean, message: string, afinidades: Array<any> } = await Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);

        if (resultado.error) {
            this.buscando_afinidad = false; 
            return message.react("❌");
        }

        this.enviarEmbed(message, Embeds.EmbedAfinidad(aniuser1, resultado.afinidades));
        this.buscando_afinidad = false;
        message.react("✅");
    }
}

export { BOT };