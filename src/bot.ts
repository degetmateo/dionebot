import { Client, Collection, GatewayIntentBits, Message, Events } from "discord.js";
import { Mensaje } from "./objetos/Mensaje";

import fs from "fs";
import path from "path";

export default class BOT extends Client {
    private commands: Collection<string, any>;
    private buscando_afinidad: Array<string>;
    private buscando_media: Array<string>;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });
        
        this.commands = new Collection();

        this.buscando_afinidad = new Array<string>();
        this.buscando_media = new Array<string>();
    }

    private loadCommands = () => {
        const commandsPath = path.join(__dirname + "/commands/");
        const commandsFiles = fs.readdirSync(commandsPath);

        for (const file of commandsFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {
                this.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`);
            }
        }
    }

    public async iniciar() {
        this.on("ready", () => console.log("BOT preparado!"));

        this.loadCommands();

        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
            if (!interaction) return;
            if (!interaction.user) return;
            if (!interaction.guild) return;
            if (!interaction.guild.id) return;

            const command = this.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, this);
            } catch (err) {
                console.error(err);
                await interaction.editReply({
                    content: "Hubo un error al ejecutar el comando.", 
                });
            }
        });

        this.on("messageCreate", async (message: Message): Promise<any> => {
            if (!message) return;
            if (message.author.bot) return;
            if (!message.guild) return;
            if (!message.guild.id) return;

            const mensaje = new Mensaje(message);
            const comando = mensaje.getComando();

            const mContent = message.content.toLowerCase()
                .split("é").join("e");

            if (comando === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            };

            if (mContent.endsWith(" que") || mContent.endsWith(" que?")) {
                return message.reply("so");
            }

            if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                message.reply("¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
            };
        
            if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                message.reply("las de doce son goood");
            };
        
            if (message.content.endsWith(" 5") || message.content.endsWith("cinco")) {
                message.reply("por el culo te la hinco");
            }
        
            if (message.content.endsWith("contexto")) {
                message.reply("Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
            }
        });
    }

    public estaBuscandoAfinidad = (serverID: string): boolean => {
        return this.buscando_afinidad.includes(serverID);
    }

    public estaBuscandoMedia = (serverID: string): boolean => {
        return this.buscando_media.includes(serverID);
    }

    public setBuscandoAfinidad = (serverID: string, buscando: boolean): void => {
        if (buscando) {
            this.buscando_afinidad.push(serverID);
        } else {
            this.buscando_afinidad = this.eliminarElementoArreglo(this.buscando_afinidad, serverID);
        }
    }

    public setBuscandoMedia = (serverID: string, buscando: boolean): void => {
        buscando ?
            this.buscando_media.push(serverID) :
            this.buscando_media = this.eliminarElementoArreglo(this.buscando_media, serverID);
    }

    public eliminarElementoArreglo = (arreglo: Array<any>, elemento: any): Array<any> => {
        return arreglo.filter(e => e != elemento);
    }
}