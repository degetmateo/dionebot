"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../../errores/NoResultsException"));
const AnilistAPI_1 = __importDefault(require("../../../apis/anilist/AnilistAPI"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
const Button_1 = __importDefault(require("../../components/Button"));
const ServerModel_1 = __importDefault(require("../../../../database/modelos/ServerModel"));
class AfinidadCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.botonPaginaPrevia = Button_1.default.CreatePrevious();
        this.botonPaginaSiguiente = Button_1.default.CreateNext();
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const bot = this.interaction.client;
        const inputUser = this.interaction.options.getUser('usuario');
        const userId = inputUser ? inputUser.id : this.interaction.user.id;
        const registeredUsers = bot.servers.getUsers(this.interaction.guild.id);
        const user = registeredUsers.find(u => u.discordId === userId);
        if (!user)
            throw new NoResultsException_1.default('Tu o el usuario especificado no están registrados.');
        const anilistUser = await AnilistAPI_1.default.fetchUserById(parseInt(user.anilistId));
        if (!anilistUser)
            throw new NoResultsException_1.default('Tu o el usuario especificado no se encuentran en Anilist.');
        let afinidades = await this.obtenerAfinidadesUsuario(anilistUser, registeredUsers);
        if (!afinidades || afinidades.length <= 0)
            throw new NoResultsException_1.default('No hay afinidades disponibles.');
        this.embeds = AfinidadCommandInteraction.obtenerEmbeds(anilistUser, afinidades);
        this.interactionIndex = 0;
        this.lastInteractionIndex = this.embeds.length - 1;
        const embed = this.embeds[this.interactionIndex];
        const res = await this.interaction.editReply({
            embeds: [embed],
            components: [this.row]
        });
        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (boton) => {
                await boton.deferUpdate();
                if (boton.customId === Button_1.default.PreviousButtonID) {
                    this.interactionIndex--;
                    if (this.interactionIndex < 0)
                        this.interactionIndex = this.lastInteractionIndex;
                }
                if (boton.customId === Button_1.default.NextButtonID) {
                    this.interactionIndex++;
                    if (this.interactionIndex > this.lastInteractionIndex)
                        this.interactionIndex = 0;
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
        try {
            await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [this.row] });
        }
        catch (error) {
            console.error(error);
            await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [] });
        }
    }
    static obtenerEmbeds(usuario, afinidades) {
        const embeds = Array();
        const numEmbeds = (afinidades.length / 10) + 1;
        for (let i = 0; i < numEmbeds; i++) {
            let parteActual = afinidades.slice(i * 10, (i * 10) + 10);
            let parteActualChequeada = new Array();
            for (const p of parteActual) {
                if (p)
                    parteActualChequeada.push(p);
            }
            if (parteActualChequeada.length <= 0)
                continue;
            const embed = new discord_js_1.EmbedBuilder();
            const informacion = parteActualChequeada.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.afinidad}%]** ▸ ${a.nombre}`).join('\n');
            embed.setDescription(informacion);
            const avatar = usuario.getAvatarURL();
            avatar ?
                embed.setThumbnail(avatar) : null;
            embed.setColor(usuario.getColor());
            embed.setTitle('Afinidad de ' + usuario.getName());
            embed.setFooter({ text: `Pagina ${i + 1} de ${(numEmbeds - 1).toFixed(0)}` });
            embeds.push(embed);
        }
        return embeds;
    }
    async obtenerAfinidadesUsuario(usuario, users) {
        var _a;
        const datos = await AnilistAPI_1.default.fetchUsersCompletedLists(usuario, users.map(u => u.anilistId));
        const mediaColeccionUsuario = datos.user;
        const mediaColeccionUsuarios = Helpers_1.default.eliminarElementosRepetidos(datos.users);
        const listaMediaUsuario = mediaColeccionUsuario.lists[0];
        if (!listaMediaUsuario)
            throw new Error('Ha ocurrido un error inesperado.');
        const mediaCompletadaUsuario = listaMediaUsuario.entries;
        const afinidades = [];
        for (const u of users) {
            if (u.anilistId == usuario.getId() + '') {
                continue;
            }
            const listaMediaUsuario2 = (_a = mediaColeccionUsuarios.find(m => m.user.id === parseInt(u.anilistId))) === null || _a === void 0 ? void 0 : _a.lists[0];
            if (!listaMediaUsuario2)
                continue;
            const mediaCompletadaUsuario2 = listaMediaUsuario2.entries;
            const resultado = await AfinidadCommandInteraction.HandleAffinity(mediaCompletadaUsuario, mediaCompletadaUsuario2);
            const usuarioDiscord = await this.interaction.client.users.fetch(u.discordId);
            if (!usuarioDiscord)
                continue;
            const nombre = usuarioDiscord.username;
            if (nombre.includes('Deleted User')) {
                await ServerModel_1.default.updateOne({ id: this.interaction.guildId }, { $pull: { users: { discordId: u.discordId } } });
                const bot = this.interaction.client;
                await bot.loadServers();
                continue;
            }
            afinidades.push({ nombre: nombre, afinidad: parseFloat(resultado.toFixed(2)) });
        }
        return AfinidadCommandInteraction.OrdenarAfinidades(afinidades);
    }
    static async HandleAffinity(animes1, animes2) {
        const mediaCompartida = AfinidadCommandInteraction.ObtenerMediaCompartida(animes1, animes2);
        return this.CalcularAfinidad(mediaCompartida);
    }
    static ObtenerMediaCompartida(l1, l2) {
        const mediaCompartida = new Array();
        for (const media of l1) {
            const media2 = l2.find(m => m.mediaId === media.mediaId);
            if (!media2)
                continue;
            mediaCompartida.push({ id: media.mediaId, scoreA: media.score, scoreB: media2.score });
        }
        return mediaCompartida;
    }
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param mediaCompartida Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    static CalcularAfinidad(mediaCompartida) {
        const scoresA = mediaCompartida.map(media => media.scoreA);
        const scoresB = mediaCompartida.map(media => media.scoreB);
        const ma = this.CalcularPromedioLista(scoresA);
        const mb = this.CalcularPromedioLista(scoresB);
        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);
        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));
        const numerador = this.SumarLista(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominador = Math.sqrt(this.SumarLista(sa) * this.SumarLista(sb));
        return (numerador <= 0 || denominador <= 0 ? 0 : numerador / denominador) * 100;
    }
    static OrdenarAfinidades(afinidades) {
        return afinidades.sort((a, b) => {
            if (a.afinidad < b.afinidad) {
                return 1;
            }
            if (a.afinidad > b.afinidad) {
                return -1;
            }
            return 0;
        });
    }
    static SumarLista(lista) {
        let suma = 0;
        for (let i = 0; i < lista.length; i++) {
            suma += lista[i];
        }
        return suma;
    }
    static CalcularPromedioLista(lista) {
        return this.SumarLista(lista) / lista.length;
    }
}
exports.default = AfinidadCommandInteraction;
AfinidadCommandInteraction.zip = (a, b) => a.map((k, i) => [k, b[i]]);
