import { Client, GatewayIntentBits, ClientEvents, Message, EmbedBuilder, ChannelType, ColorResolvable } from "discord.js";

import { Obra } from "../objetos/Obra";
import { Usuario } from "../objetos/Usuario";
import { DB } from "./Database";
import Aniuser from "../modelos/Aniuser";
import { Mensaje } from "../objetos/Mensaje";

import { Media } from "../modulos/Media";
import { Usuarios } from "../modulos/Usuarios";
import { Afinidad } from "../modulos/Afinidad";
import { Setup } from "../modulos/Setup";
import { Embeds } from "../modulos/Embeds";

export default class BOT {
    private client: Client;
    private db: DB;

    private buscando_afinidad: Array<string>;
    private buscando_media: Array<string>;

    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });

        this.db = new DB();

        this.buscando_afinidad = new Array<string>();
        this.buscando_media = new Array<string>();
    }

    public async iniciar() {
        this.on("ready", () => console.log("BOT preparado!"));

        this.on("messageCreate", async (message: Message) => {
            if (!message) return;
            if (message.author.bot) return;
            if (!message.guild) return;
            if (!message.guild.id) return;

            const mensaje = new Mensaje(message);
            const comando = mensaje.getComando();
            const args = mensaje.getArgumentos();

            if (comando == "!anime") {
                return await this.obra(message, "ANIME", args, false);
            }

            if (comando == "!animeb") {
                return await this.obra(message, "ANIME", args, true);
            }
        
            if (comando == "!manga") {
                return await this.obra(message, "MANGA", args, false);
            }
        
            if (comando == "!mangab") {
                return await this.obra(message, "MANGA", args, true);
            }

            if (comando === "!color") {
                return await this.color(message, args[0]);
            }

            if (comando == "!user") {
                return await this.user(message, args[0]);
            }
        
            if (comando == "!setup") {
                return await this.setup(message, args[0]);
            }
        
            if (comando == "!unsetup") {
                return await this.unsetup(message);
            }
        
            if (comando == "!afinidad") {
                return await this.afinidad(message, args);
            }

            if (comando == "!help") {
                return this.enviarEmbed(message, Embeds.EmbedInformacionHelp());
            }

            if (comando === "!ruleta") {
                return await this.ruleta(message);
            }

            const mContent = message.content.toLowerCase()
                .split("é").join("e");

            if (comando === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            };

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

    public getServerCount = (): number => this.client.guilds.cache.size;

    private on = (event: keyof ClientEvents, func: any): void => {
        this.client.on(event, func);
    }

    private responder(message: Message, text: string) {
        message.reply(text);
    }

    private enviarEmbed(message: Message, embed: EmbedBuilder) {
        message.channel.send({ embeds: [embed] });
    }

    private color = async (message: Message, colorCode: string) => {
        if (!colorCode || colorCode.trim() == "" || colorCode.trim().length <= 0) return message.react("❌");

        const colorRoleCode = "0x" + (colorCode.split("#").join(""));
        const color = colorRoleCode as ColorResolvable;

        if (!color) {
            message.react("❌");
            return;
        }

        const waitingReaction = await message.react("🔄");

        const memberColorRole = message.member?.roles.cache.find(r => r.name === message.member?.user.username);

        if (!memberColorRole) {
            const guildColorRole = message.guild?.roles.cache.find(r => r.name === message.member?.user.username);

            if (!guildColorRole) {
                const newRole = await message.guild?.roles.create({
                    name: message.member?.user.username,
                    color: color
                });

                if (!newRole) {
                    waitingReaction.remove();
                    message.react("❌");
                    return;
                }

                message.member?.roles.add(newRole);
            } else {
                guildColorRole.setColor(color);
                message.member?.roles.add(guildColorRole);
            }
        } else {
            const newMemberRole = await memberColorRole.setColor(color);

            if (!newMemberRole) {
                waitingReaction.remove();
                message.react("❌");
                return;
            }
        }

        return message.react("✅");
    }

    private user = async (message: Message, args: string) => {
        let usuario: Usuario | null;

        const serverID = message.guild?.id;

        if (!serverID) {
            message.react("❌");
            return;
        }

        const reaccionEspera = await message.react("🔄");

        if (!args || args.length <= 0) {
            usuario = await this.usuario(message.guild.id, message.author.id);
        } else {
            const usuarioMencionado = message.mentions.members?.first();
            
            if (usuarioMencionado) {
                usuario = await this.usuario(message.guild.id, usuarioMencionado.id);
            } else {
                usuario = await this.usuario(message.guild.id, args);
            }
        }
        
        if (!usuario) {
            reaccionEspera.remove();
            return message.react("❌");
        }

        const embed = Embeds.EmbedInformacionUsuario(usuario);

        reaccionEspera.remove();
        message.react("✅");

        this.enviarEmbed(message, embed);
    }

    private obra = async (message: Message, tipo: string, args: Array<string>, traducir: boolean) => {
        const serverID = message.guild?.id;

        if (!serverID) {
            message.react("❌");
            return;
        }

        if (this.estaBuscandoMedia(serverID)) {
            message.react("⛔");
            return;
        }

        this.setBuscandoMedia(serverID, true);
        
        const reaccionEspera = await message.react("🔄");
        const media = await this.buscarMedia(tipo, args.join(" "));

        if (!media) {
            reaccionEspera.remove();
            message.react("❌");
            this.setBuscandoMedia(serverID, false);
            return null;
        }

        const embedInformacion = await Embeds.EmbedInformacionMedia(message, media, traducir);

        reaccionEspera.remove();
        message.react("✅");

        this.enviarEmbed(message, embedInformacion);

        this.setBuscandoMedia(serverID, false);
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

    private async setup(message: Message, username: string): Promise<void> {
        const reaccionEspera = await message.react("🔄");
        const resultado = await Setup.SetupUsuario(username, message);

        if (!resultado) {
            reaccionEspera.remove();
            message.react("❌");
            return;
        }

        reaccionEspera.remove();
        message.react("✅");
    }

    private async unsetup(message: Message): Promise<void> {
        const reaccionEspera = await message.react("🔄");
        const resultado = await Setup.UnsetupUsuario(message);

        if (!resultado) {
            reaccionEspera.remove();
            message.react("❌");
            return;
        }

        reaccionEspera.remove();
        message.react("✅");
    }

    private estaBuscandoAfinidad = (serverID: string): boolean => {
        return this.buscando_afinidad.includes(serverID);
    }

    private estaBuscandoMedia = (serverID: string): boolean => {
        return this.buscando_media.includes(serverID);
    }

    private setBuscandoAfinidad = (serverID: string, buscando: boolean): void => {
        buscando ? 
            this.buscando_afinidad.push(serverID) : 
            this.buscando_afinidad = this.eliminarElementoArreglo(this.buscando_afinidad, serverID);
    }

    private setBuscandoMedia = (serverID: string, buscando: boolean): void => {
        buscando ?
            this.buscando_media.push(serverID) :
            this.buscando_media = this.eliminarElementoArreglo(this.buscando_media, serverID);
    }

    private eliminarElementoArreglo = (arreglo: Array<any>, elemento: any): Array<any> => {
        return arreglo.filter(e => e != elemento);
    }

    private afinidad = async (message: Message, args: Array<string>) => {
        const serverID = message.guild?.id;
        if (!serverID) return;

        if (this.estaBuscandoAfinidad(serverID)) {
            return message.react("⛔");
        }

        this.setBuscandoAfinidad(serverID, true);
        const waitingReaction = await message.react("🔄");
    
        if (!serverID) {
            this.setBuscandoAfinidad(serverID, false);
            waitingReaction.remove();
            return message.react("❌");
        }

        let userID: string;

        if (!args[0]) {
            userID = message.author.id;
        }

        else if (message.mentions.members?.first()) {
            const uMencionado = message.mentions.members?.first();

            if (!uMencionado) {
                this.setBuscandoAfinidad(serverID, false);
                waitingReaction.remove();
                return message.react("❌");
            }

            userID = uMencionado.id;
        }

        else {
            const username = args[0];
            const user = await Aniuser.findOne({ anilistUsername: username });

            if (!user) {
                this.setBuscandoAfinidad(serverID, false);
                waitingReaction.remove();
                return message.react("❌");
            }

            if (!user?.discordId) {
                this.setBuscandoAfinidad(serverID, false);
                waitingReaction.remove();
                return message.react("❌");
            }

            userID = user.discordId;
        }

        const uRegistrados = await Aniuser.find({ serverId: serverID });
        const usuario = uRegistrados.find(u => u.discordId == userID);

        if (!usuario) {
            this.setBuscandoAfinidad(serverID, false);
            waitingReaction.remove();
            return message.react("❌");
        }
        if (!usuario.anilistUsername) {
            this.setBuscandoAfinidad(serverID, false);
            waitingReaction.remove();
            return message.react("❌");
        }

        const aniuser1 = await this.usuario(serverID, usuario.anilistUsername);

        if (!aniuser1) {
            this.setBuscandoAfinidad(serverID, false);
            waitingReaction.remove();
            return message.react("❌");
        }

        const resultado = await Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);

        if (resultado.error) {
            this.setBuscandoAfinidad(serverID, false);
            waitingReaction.remove();
            return message.react("❌");
        }

        this.enviarEmbed(message, Embeds.EmbedAfinidad(aniuser1, resultado.afinidades));
        this.setBuscandoAfinidad(serverID, false);
        waitingReaction.remove();
        message.react("✅");
    }

    private ruleta = async (message: Message): Promise<void> => {
        const number = Math.floor(Math.random() * 6);

        const ImagenCargando = "https://media.discordapp.net/attachments/712773186336456766/1040413408199180328/ruletaCargando.gif";
        const ImagenDisparo = "https://media.discordapp.net/attachments/712773186336456766/1040418304797462568/ruletaDisparo.gif";
        const ImagenFallo = "https://media.discordapp.net/attachments/712773186336456766/1040418327052423288/ruletaFallogif.gif";

        const EmbedImagenCargando = new EmbedBuilder()
            .setImage(ImagenCargando)
            .setFooter({ text: "..." });

        const EmbedImagenDisparo = new EmbedBuilder()
            .setImage(ImagenDisparo)

        const EmbedImagenFallo = new EmbedBuilder()
            .setImage(ImagenFallo)
            .setFooter({ text: "Uf..." });

        let embedActual = await message.reply({ embeds: [EmbedImagenCargando] });

        setTimeout(async () => {
            if (number === 1) {        
                const channel = await message.channel.fetch();
                const invite = channel.type === ChannelType.GuildText ? await channel.createInvite() : null;

                await embedActual.edit({ embeds: [EmbedImagenDisparo] });
                invite ? await message.member?.user.send(invite.url) : null;
                message.member?.kick();
            } else {
                embedActual.edit({ embeds: [EmbedImagenFallo] });
            }
        }, 1700);
    }
}