import { ChatInputCommandInteraction, CacheType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import NoResultsException from "../../../../errores/NoResultsException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import Helpers from "../../../Helpers";
import Button from "../../components/Button";
import AnilistUser from "../../../apis/anilist/modelos/AnilistUser";
import { Afinidad, MediaCompartida } from "../../tipos/Afinidad";
import { uRegistrado } from "../../../tipos";
import ServerModel from "../../../../database/modelos/ServerModel";
import { User } from "../../../../database/types";

export default class AfinidadCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private embeds: Array<EmbedBuilder>;
    private interactionIndex: number;
    private lastInteractionIndex: number;

    private botonPaginaPrevia = Button.CreatePrevious();
    private botonPaginaSiguiente = Button.CreateNext();

    private row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const bot = this.interaction.client as Bot;

        const inputUser = this.interaction.options.getUser('usuario');
        const userId = inputUser ? inputUser.id : this.interaction.user.id;

        const registeredUsers = bot.servers.getUsers(this.interaction.guild.id);
        const user = registeredUsers.find(u => u.discordId === userId);

        if (!user) throw new NoResultsException('Tu o el usuario especificado no están registrados.');

        const anilistUser = await AnilistAPI.fetchUserById(parseInt(user.anilistId));

        if (!anilistUser) throw new NoResultsException('Tu o el usuario especificado no se encuentran en Anilist.');
    
        let afinidades = await this.obtenerAfinidadesUsuario(anilistUser, registeredUsers);
    
        if (!afinidades || afinidades.length <= 0) throw new NoResultsException('No hay afinidades disponibles.');
    
        this.embeds = AfinidadCommandInteraction.obtenerEmbeds(anilistUser, afinidades);
    
        this.interactionIndex = 0;
        this.lastInteractionIndex = this.embeds.length - 1;
    
        const embed = this.embeds[this.interactionIndex];
    
        const res = await this.interaction.editReply({
            embeds: [embed],
            components: [this.row]
        })
    
        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
            });
            
            collector.on('collect', async (boton: ButtonInteraction) => {
                await boton.deferUpdate();

                if (boton.customId === Button.PreviousButtonID) {
                    this.interactionIndex--;
                    if (this.interactionIndex < 0) this.interactionIndex = this.lastInteractionIndex;  
                }

                if (boton.customId === Button.NextButtonID) {
                    this.interactionIndex++;
                    if (this.interactionIndex > this.lastInteractionIndex) this.interactionIndex = 0;
                }

                await this.actualizarInteraccion(boton);
            })
        } catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }
    
        private async actualizarInteraccion (boton: ButtonInteraction) {
            try {
                await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [this.row] }); 
            } catch (error) {            
                console.error(error);
                await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [] });
            }
        }
    
        private static obtenerEmbeds (usuario: AnilistUser, afinidades: Array<Afinidad>): Array<EmbedBuilder> {
            const embeds = Array<EmbedBuilder>();
            const numEmbeds = (afinidades.length / 10) + 1;
    
            for (let i = 0; i < numEmbeds; i++) {
                let parteActual = afinidades.slice(i * 10, (i * 10) + 10);
                let parteActualChequeada = new Array<{ nombre: string, afinidad: number }>();
    
                for (const p of parteActual) {
                    if (p) parteActualChequeada.push(p);
                }
    
                if (parteActualChequeada.length <= 0) continue;
    
                const embed = new EmbedBuilder();
                const informacion: string = parteActualChequeada.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.afinidad}%]** ▸ ${a.nombre}`).join('\n');
                
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
        
        private async obtenerAfinidadesUsuario (usuario: AnilistUser, users: Array<User>) {
            const datos = await AnilistAPI.fetchUsersCompletedLists(usuario, users.map(u => u.anilistId));
    
            const mediaColeccionUsuario = datos.user;
            const mediaColeccionUsuarios = Helpers.eliminarElementosRepetidos(datos.users);
    
            const listaMediaUsuario = mediaColeccionUsuario.lists[0];
    
            if (!listaMediaUsuario) throw new Error('Ha ocurrido un error inesperado.');
    
            const mediaCompletadaUsuario = listaMediaUsuario.entries;
            
            const afinidades: Array<Afinidad> = [];
    
            for (const u of users) {
                if (u.anilistId == usuario.getId() + '') {
                    continue;
                }
    
                const listaMediaUsuario2 = mediaColeccionUsuarios.find(m => m.user.id === parseInt(u.anilistId))?.lists[0]; 
                if (!listaMediaUsuario2) continue;
                const mediaCompletadaUsuario2 = listaMediaUsuario2.entries;
    
                const resultado = await AfinidadCommandInteraction.HandleAffinity(mediaCompletadaUsuario, mediaCompletadaUsuario2);
    
                const usuarioDiscord = await this.interaction.client.users.fetch(u.discordId);
    
                if (!usuarioDiscord) continue;
    
                const nombre = usuarioDiscord.username;
                
                if (nombre.includes('Deleted User')) {
                    await ServerModel.updateOne(
                        { id: this.interaction.guildId },
                        { $pull: { users: { discordId: u.discordId } } });
                    
                    const bot = this.interaction.client as Bot;
                    await bot.loadServers();

                    continue;
                }
                
                afinidades.push({ nombre: nombre, afinidad: parseFloat(resultado.toFixed(2)) });
            }
    
            return AfinidadCommandInteraction.OrdenarAfinidades(afinidades);
        }
    
        private static async HandleAffinity (animes1: Array<{ mediaId: number, score: number }>, animes2: Array<{ mediaId: number, score: number }>) {
            const mediaCompartida = AfinidadCommandInteraction.ObtenerMediaCompartida(animes1, animes2);
            return this.CalcularAfinidad(mediaCompartida);
        }
    
        private static ObtenerMediaCompartida(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
            const mediaCompartida = new Array<MediaCompartida>();
    
            for (const media of l1) {
                const media2 = l2.find(m => m.mediaId === media.mediaId);
                if (!media2) continue;
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
    
        private static CalcularAfinidad(mediaCompartida: Array<MediaCompartida>): number {
            const scoresA: Array<number> = mediaCompartida.map(media => media.scoreA);
            const scoresB: Array<number> = mediaCompartida.map(media => media.scoreB);
    
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
    
        private static zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);
    
        private static OrdenarAfinidades(afinidades: Array<Afinidad>): Array<Afinidad> {
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
    
        private static SumarLista(lista: Array<number>): number {
            let suma: number = 0;
    
            for (let i = 0; i < lista.length; i++) {
                suma += lista[i];
            }
    
            return suma;
        }
    
        private static CalcularPromedioLista(lista: Array<number>): number {
            return this.SumarLista(lista) / lista.length;
        }
    }