"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Aniuser_1 = __importDefault(require("./modelos/Aniuser"));
class BOT extends discord_js_1.Client {
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent],
            presence: {
                status: "online",
                activities: [{
                        name: "/help",
                        type: discord_js_1.ActivityType.Listening
                    }]
            }
        });
        this.loadCommands = () => {
            const commandsPath = path_1.default.join(__dirname + "/comandos/");
            const commandsFiles = fs_1.default.readdirSync(commandsPath);
            for (const file of commandsFiles) {
                const filePath = path_1.default.join(commandsPath, file);
                const command = require(filePath);
                if ("data" in command && "execute" in command) {
                    this.commands.set(command.data.name, command);
                }
                else {
                    console.log(`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`);
                }
            }
        };
        this.insertarUsuario = (usuario) => {
            this.usuarios.push(usuario);
        };
        this.eliminarUsuario = (serverId, userId) => {
            this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
        };
        this.existeUsuario = (usuario) => {
            for (let i = 0; i < this.usuarios.length; i++) {
                const cond = this.usuarios[i].serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && this.usuarios[i].discordId === usuario.discordId;
                if (cond)
                    return true;
            }
            return false;
        };
        this.getUsuario = (usuario) => {
            return this.usuarios.find(u => u.serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && u.discordId === usuario.discordId);
        };
        this.getUsuariosRegistrados = (serverID) => {
            return this.usuarios.filter(u => u.serverId === serverID);
        };
        this.loadUsers = async () => {
            const aniusers = await Aniuser_1.default.find();
            for (let i = 0; i < aniusers.length; i++) {
                const serverID = aniusers[i].serverId;
                const dsID = aniusers[i].discordId;
                const anilistUsername = aniusers[i].anilistUsername;
                const anilistID = aniusers[i].anilistId;
                if (!serverID || !dsID || !anilistUsername || !anilistID) {
                    continue;
                }
                this.insertarUsuario({
                    serverId: serverID,
                    discordId: dsID,
                    anilistUsername: anilistUsername,
                    anilistId: anilistID
                });
            }
        };
        this.isGettingAfinitty = (serverID) => {
            return this.buscando_afinidad.has(serverID);
        };
        this.isSearchingMedia = (serverID) => {
            return this.buscando_media.has(serverID);
        };
        this.setGettingAffinity = (serverID, buscando) => {
            buscando ?
                this.buscando_afinidad.add(serverID) :
                this.buscando_afinidad.delete(serverID);
        };
        this.setSearchingMedia = (serverID, buscando) => {
            buscando ?
                this.buscando_media.add(serverID) :
                this.buscando_media.delete(serverID);
        };
        this.commands = new discord_js_1.Collection();
        this.buscando_afinidad = new Set();
        this.buscando_media = new Set();
        this.usuarios = new Array();
    }
    async iniciar(token) {
        this.on("ready", () => {
            console.log("BOT preparado!");
        });
        await this.loadUsers();
        setInterval(async () => {
            await this.loadUsers();
        }, 300000);
        this.loadCommands();
        this.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            if (!interaction)
                return;
            if (!interaction.user)
                return;
            if (!interaction.guild)
                return;
            if (!interaction.guild.id)
                return;
            const command = this.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            }
            catch (err) {
                const error = err;
                console.error(error);
                if (!interaction)
                    return;
                if (interaction.replied) {
                    interaction.editReply({ content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde." })
                        .catch(err => console.error(err));
                }
                else {
                    interaction.reply({ content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.", ephemeral: true })
                        .catch(err => console.error(err));
                }
            }
        });
        this.on("messageCreate", async (message) => {
            if (!message)
                return;
            if (!message.content)
                return;
            if (!message.guild)
                return;
            if (message.author.bot)
                return;
            const mContent = message.content.toLowerCase()
                .split("á").join("a")
                .split("é").join("e")
                .split("í").join("i")
                .split("ó").join("o")
                .split("ú").join("u")
                .split("?").join("")
                .split("¿").join("");
            if (!mContent)
                return;
            const CONDICION_RESPUESTA_QUE = mContent.endsWith(" que") || mContent == "que";
            const CONDICION_RESPUESTA_TRECE = mContent.endsWith(" 13") || mContent == "13" || mContent.endsWith("trece");
            const CONDICION_RESPUESTA_DOCE = mContent.endsWith(" 12") || mContent == "12" || mContent.endsWith("doce");
            const CONDICION_RESPUESTA_CINCO = mContent.endsWith(" 5") || mContent == "5" || mContent.endsWith("cinco");
            const CONDICION_RESPUESTA_CONTEXTO = mContent.endsWith(" contexto") || mContent == "contexto";
            if (message.content === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            }
            ;
            if (CONDICION_RESPUESTA_QUE) {
                return message.reply("so");
            }
            if (CONDICION_RESPUESTA_DOCE) {
                message.reply("las de doce son goood");
            }
            ;
            if (CONDICION_RESPUESTA_CINCO) {
                message.reply("por el culo te la hinco");
            }
            if (CONDICION_RESPUESTA_TRECE) {
                message.reply("¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
            }
            ;
            if (CONDICION_RESPUESTA_CONTEXTO) {
                message.reply("Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
            }
        });
        this.login(token);
    }
}
exports.default = BOT;
