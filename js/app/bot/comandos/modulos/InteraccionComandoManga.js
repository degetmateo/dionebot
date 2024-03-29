// import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonInteraction } from "discord.js";
// import Manga from "../../apis/anilist/modelos/media/Manga";
// import Button from "../components/Button";
// import AnilistAPI from "../../apis/anilist/AnilistAPI";
// import Notas from "../../apis/anilist/modelos/media/Notas";
// import { Media } from "../../apis/anilist/tipos/TiposMedia";
// import Bot from "../../Bot";
// import Helpers from "../../Helpers";
// import ErrorArgumentoInvalido from "../../../errores/ErrorArgumentoInvalido";
// import ErrorSinResultados from "../../../errores/ErrorSinResultados";
// import EmbedManga from "../../embeds/EmbedManga";
// import EmbedScores from "../../embeds/EmbedScores";
// import { MediaList } from "../../apis/anilist/tipos/MediaList";
// import CommandInteraction from "../interactions/CommandInteraction";
// export default class InteraccionComandoManga extends CommandInteraction {
//     protected interaction: ChatInputCommandInteraction<CacheType>;
//     private bot: Bot;
//     private idServidor: string;
//     private criterioBusqueda: string;
//     private criterioEsID: boolean;
//     private traducirInformacion: boolean;
//     private indiceInteraccion: number;
//     private ultimoIndiceInteraccion: number;
//     private mangas: Array<Manga>;
//     private embeds: Array<EmbedManga>;
//     private botonPaginaPrevia = Button.CreatePrevious();
//     private botonPaginaSiguiente = Button.CreateNext();
//     private row = new ActionRowBuilder<ButtonBuilder>()
//         .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);
//     private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
//         super();
//         this.interaction = interaction;
//         this.bot = this.interaction.client as Bot;
//         this.idServidor = this.interaction.guild?.id as string;
//         this.criterioBusqueda = this.interaction.options.getString('nombre-o-id') as string;
//         this.criterioEsID = Helpers.isNumber(this.criterioBusqueda);
//         this.traducirInformacion = this.interaction.options.getBoolean('traducir') || false;
//         this.indiceInteraccion = 0;
//         this.ultimoIndiceInteraccion = 0;
//         this.mangas = new Array<Manga>();
//         this.embeds = new Array<EmbedManga>();
//     }
//     public async execute () {
//         await this.interaction.deferReply();
//         this.criterioEsID ? 
//             await this.buscarMangaPorID() :
//             await this.buscarMangaPorNombre();            
//     }
//     private async buscarMangaPorID () {
//         const mangaID = parseInt(this.criterioBusqueda);
//         if (mangaID < 0 || mangaID > CommandInteraction.NUMERO_MAXIMO_32_BITS) {
//             throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
//         }
//         const resultado: Media = await AnilistAPI.buscarMangaPorID(mangaID);
//         const manga: Manga = new Manga(resultado);
//         const embedManga = this.traducirInformacion ? await EmbedManga.CrearTraducido(manga) : EmbedManga.Crear(manga);
//         const notas = await this.obtenerNotasUsuarios(parseInt(this.criterioBusqueda));
//         const embedNotas = EmbedScores.Create(notas);
//         try {
//             await this.interaction.editReply({ embeds: [embedManga, embedNotas] }); 
//         } catch (error) {
//             await this.interaction.editReply({ embeds: [embedManga] });
//             console.error(error);
//         }
//     }
//     private async buscarMangaPorNombre () {
//         const resultados = await AnilistAPI.buscarMangaPorNombre(this.criterioBusqueda);
//         if (!resultados || resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
//         this.mangas = new Array<Manga>();
//         this.embeds = new Array<EmbedManga>();
//         for (const resultado of resultados) {
//             const manga = new Manga(resultado);
//             this.mangas.push(manga);
//             this.embeds.push(this.traducirInformacion ? await EmbedManga.CrearTraducido(manga) : EmbedManga.Crear(manga));
//         }
//         this.indiceInteraccion = 0;
//         this.ultimoIndiceInteraccion = this.embeds.length - 1;
//         const manga = this.mangas[this.indiceInteraccion];
//         const notas = await this.obtenerNotasUsuarios(manga.obtenerID());
//         const embedManga = this.embeds[this.indiceInteraccion];
//         const embedNotas = EmbedNotas.Crear(notas, manga);
//         const embeds = notas.hayNotas() ?
//             [embedManga, embedNotas] : [embedManga];
//         const respuesta = await this.interaction.editReply({
//             embeds: embeds,
//             components: [this.row]
//         })
//         try {
//             const collector = respuesta.createMessageComponentCollector({
//                 time: InteraccionComando.TIEMPO_ESPERA_INTERACCION
//             });
//             collector.on('collect', async (boton: ButtonInteraction) => {
//                 await boton.deferUpdate();
//                 if (boton.customId === Boton.PreviousButtonID) {
//                     this.indiceInteraccion--;
//                     if (this.indiceInteraccion < 0) this.indiceInteraccion = this.ultimoIndiceInteraccion;  
//                 }
//                 if (boton.customId === Boton.NextButtonID) {
//                     this.indiceInteraccion++;
//                     if (this.indiceInteraccion > this.ultimoIndiceInteraccion) this.indiceInteraccion = 0;
//                 }
//                 await this.actualizarInteraccion(boton);
//             })
//         } catch (error) {
//             await this.interaction.editReply({ components: [] });
//             console.error(error);
//         }
//     }
//     private async actualizarInteraccion (boton: ButtonInteraction) {
//         if (this.bot.interacciones.existe(this.interaction.id)) return;
//         this.bot.interacciones.agregar(this.interaction.id);
//         try {
//             const manga = this.mangas[this.indiceInteraccion];
//             const notas = await this.obtenerNotasUsuarios(manga.obtenerID());
//             if (!notas.hayNotas()) {
//                 await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] }); 
//             } else {
//                 const embedNotas = EmbedNotas.Crear(notas, manga);
//                 await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion], embedNotas], components: [this.row] }); 
//             }
//         } catch (error) {
//             if (error instanceof Error) {
//                 if (error.message.toLowerCase().includes('too many requests')) {
//                     await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [] });
//                     return;
//                 }
//             }
//             await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] });
//         }
//         this.bot.interacciones.eliminar(this.interaction.id);
//     }
//     private async obtenerNotasUsuarios (animeID: number): Promise<Notas> {
//         let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.idServidor);
//         usuarios = Helpers.eliminarElementosRepetidos(usuarios);
//         let notasUsuarios = await AnilistAPI.buscarEstadoMediaUsuarios(usuarios, animeID);
//         notasUsuarios = Helpers.eliminarElementosRepetidos(notasUsuarios);
//         let completadas = notasUsuarios.filter(ml => ml.status === 'COMPLETED');
//         let progreso = notasUsuarios.filter(ml => ml.status === 'CURRENT');
//         let dropeadas = notasUsuarios.filter(ml => ml.status === 'DROPPED');
//         let pausadas = notasUsuarios.filter(ml => ml.status === 'PAUSED');
//         let planificadas = notasUsuarios.filter(ml => ml.status === 'PLANNING');
//         completadas = await this.obtenerNombresDiscord(completadas);
//         progreso = await this.obtenerNombresDiscord(progreso);
//         dropeadas = await this.obtenerNombresDiscord(dropeadas);
//         pausadas = await this.obtenerNombresDiscord(pausadas);
//         planificadas = await this.obtenerNombresDiscord(planificadas);
//         return new Notas(completadas, progreso, dropeadas, planificadas, pausadas);
//     }
//     private async obtenerNombresDiscord (notas: MediaList[]): Promise<MediaList[]> {
//         let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.idServidor);
//         usuarios = Helpers.eliminarElementosRepetidos(usuarios);
//         const notasConNombres = new Array<MediaList>();
//         for (const nota of notas) {
//             const usuario = usuarios.find(ur => parseInt(ur.anilistId) === nota.user.id);
//             const usuarioDiscord = await this.bot.users.fetch(usuario?.discordId as string);
//             notasConNombres.push({
//                 id: nota.id, 
//                 mediaId: nota.mediaId,
//                 progress: nota.progress,
//                 repeat: nota.repeat,
//                 score: nota.score,
//                 status: nota.status,
//                 user: {
//                     id: nota.user.id,
//                     name: usuarioDiscord.username
//                 }
//             })
//         }
//         return notasConNombres;
//     }
// }
