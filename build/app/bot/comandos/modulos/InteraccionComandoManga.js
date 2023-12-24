"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const Manga_1 = __importDefault(require("../../apis/anilist/modelos/media/Manga"));
const Boton_1 = __importDefault(require("../componentes/Boton"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Notas_1 = __importDefault(require("../../apis/anilist/modelos/media/Notas"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const ErrorArgumentoInvalido_1 = __importDefault(require("../../../errores/ErrorArgumentoInvalido"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
const EmbedManga_1 = __importDefault(require("../../embeds/EmbedManga"));
const EmbedNotas_1 = __importDefault(require("../../embeds/EmbedNotas"));
class InteraccionComandoManga extends InteraccionComando_1.default {
    constructor(interaction) {
        var _a;
        super();
        this.botonPaginaPrevia = Boton_1.default.CrearPrevio();
        this.botonPaginaSiguiente = Boton_1.default.CrearSiguiente();
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);
        this.interaction = interaction;
        this.bot = this.interaction.client;
        this.idServidor = (_a = this.interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        this.criterioBusqueda = this.interaction.options.getString('nombre-o-id');
        this.criterioEsID = Helpers_1.default.esNumero(this.criterioBusqueda);
        this.traducirInformacion = this.interaction.options.getBoolean('traducir') || false;
        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = 0;
        this.mangas = new Array();
        this.embeds = new Array();
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoManga(interaction);
        await modulo.execute();
    }
    async execute() {
        await this.interaction.deferReply();
        this.criterioEsID ?
            await this.buscarMangaPorID() :
            await this.buscarMangaPorNombre();
    }
    async buscarMangaPorID() {
        const mangaID = parseInt(this.criterioBusqueda);
        if (mangaID < 0 || mangaID > InteraccionComando_1.default.NUMERO_MAXIMO_32_BITS) {
            throw new ErrorArgumentoInvalido_1.default('La ID que has ingresado no es valida.');
        }
        const resultado = await AnilistAPI_1.default.buscarMangaPorID(mangaID);
        const manga = new Manga_1.default(resultado);
        const embedManga = this.traducirInformacion ? await EmbedManga_1.default.CrearTraducido(manga) : EmbedManga_1.default.Crear(manga);
        const notas = await this.obtenerNotasUsuarios(parseInt(this.criterioBusqueda));
        const embedNotas = EmbedNotas_1.default.Crear(notas, manga);
        try {
            await this.interaction.editReply({ embeds: [embedManga, embedNotas] });
        }
        catch (error) {
            await this.interaction.editReply({ embeds: [embedManga] });
            console.error(error);
        }
    }
    async buscarMangaPorNombre() {
        const resultados = await AnilistAPI_1.default.buscarMangaPorNombre(this.criterioBusqueda);
        if (!resultados || resultados.length <= 0)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        this.mangas = new Array();
        this.embeds = new Array();
        for (const resultado of resultados) {
            const manga = new Manga_1.default(resultado);
            this.mangas.push(manga);
            this.embeds.push(this.traducirInformacion ? await EmbedManga_1.default.CrearTraducido(manga) : EmbedManga_1.default.Crear(manga));
        }
        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = this.embeds.length - 1;
        const manga = this.mangas[this.indiceInteraccion];
        const notas = await this.obtenerNotasUsuarios(manga.obtenerID());
        const embedManga = this.embeds[this.indiceInteraccion];
        const embedNotas = EmbedNotas_1.default.Crear(notas, manga);
        const embeds = notas.hayNotas() ?
            [embedManga, embedNotas] : [embedManga];
        const respuesta = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        });
        try {
            const collector = respuesta.createMessageComponentCollector({
                time: InteraccionComando_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (boton) => {
                await boton.deferUpdate();
                if (boton.customId === Boton_1.default.BotonPrevioID) {
                    this.indiceInteraccion--;
                    if (this.indiceInteraccion < 0)
                        this.indiceInteraccion = this.ultimoIndiceInteraccion;
                }
                if (boton.customId === Boton_1.default.BotonSiguienteID) {
                    this.indiceInteraccion++;
                    if (this.indiceInteraccion > this.ultimoIndiceInteraccion)
                        this.indiceInteraccion = 0;
                }
                await this.actualizarInteraccion(boton);
            });
        }
        catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }
    async actualizarInteraccion(boton) {
        if (this.bot.interacciones.existe(this.interaction.id))
            return;
        this.bot.interacciones.agregar(this.interaction.id);
        try {
            const manga = this.mangas[this.indiceInteraccion];
            const notas = await this.obtenerNotasUsuarios(manga.obtenerID());
            if (!notas.hayNotas()) {
                await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] });
            }
            else {
                const embedNotas = EmbedNotas_1.default.Crear(notas, manga);
                await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion], embedNotas], components: [this.row] });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [] });
                    return;
                }
            }
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] });
        }
        this.bot.interacciones.eliminar(this.interaction.id);
    }
    async obtenerNotasUsuarios(animeID) {
        let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.idServidor);
        usuarios = Helpers_1.default.eliminarElementosRepetidos(usuarios);
        let notasUsuarios = await AnilistAPI_1.default.buscarEstadoMediaUsuarios(usuarios, animeID);
        notasUsuarios = Helpers_1.default.eliminarElementosRepetidos(notasUsuarios);
        let completadas = notasUsuarios.filter(ml => ml.status === 'COMPLETED');
        let progreso = notasUsuarios.filter(ml => ml.status === 'CURRENT');
        let dropeadas = notasUsuarios.filter(ml => ml.status === 'DROPPED');
        let pausadas = notasUsuarios.filter(ml => ml.status === 'PAUSED');
        let planificadas = notasUsuarios.filter(ml => ml.status === 'PLANNING');
        completadas = await this.obtenerNombresDiscord(completadas);
        progreso = await this.obtenerNombresDiscord(progreso);
        dropeadas = await this.obtenerNombresDiscord(dropeadas);
        pausadas = await this.obtenerNombresDiscord(pausadas);
        planificadas = await this.obtenerNombresDiscord(planificadas);
        return new Notas_1.default(completadas, progreso, dropeadas, planificadas, pausadas);
    }
    async obtenerNombresDiscord(notas) {
        let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.idServidor);
        usuarios = Helpers_1.default.eliminarElementosRepetidos(usuarios);
        const notasConNombres = new Array();
        for (const nota of notas) {
            const usuario = usuarios.find(ur => parseInt(ur.anilistId) === nota.user.id);
            const usuarioDiscord = await this.bot.users.fetch(usuario === null || usuario === void 0 ? void 0 : usuario.discordId);
            notasConNombres.push({
                id: nota.id,
                mediaId: nota.mediaId,
                progress: nota.progress,
                repeat: nota.repeat,
                score: nota.score,
                status: nota.status,
                user: {
                    id: nota.user.id,
                    name: usuarioDiscord.username
                }
            });
        }
        return notasConNombres;
    }
}
exports.default = InteraccionComandoManga;
