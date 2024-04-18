import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import DB from "../../../database/DB";
import GenericException from "../../../errors/GenericException";
import IllegalArgumentException from "../../../errors/IllegalArgumentException";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import { Platform } from "./types";
import Embed from "../../embeds/Embed";

export default class SetupCommandInteraction extends CommandInteraction {
    private static readonly MAX_USERS = 15;
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        await this.interaction.deferReply({ ephemeral: true });
        
        const platform = this.interaction.options.getString('plataforma') as Platform;
        const query = this.interaction.options.getString('nombre-o-id');

        if (platform === 'MyAnimeList' || platform === 'VisualNovelDatabase') {
            throw new IllegalArgumentException('La plataforma que has elegido no se encuentra disponible.');
        }

        const bot = this.interaction.client as Bot;
        const serverId = this.interaction.guildId;
        const userId = this.interaction.user.id;

        const registeredUsers = bot.servers.getUsers(serverId);
        
        if (registeredUsers.length >= SetupCommandInteraction.MAX_USERS) {
            throw new GenericException('Se ha alcanzado la cantidad máxima de usuarios registrados en este servidor.');
        }
        
        if (registeredUsers.find(user => user.discordId === userId)) {
            throw new GenericException('Ya te encuentras registrado.');
        }

        let anilistUser: AnilistUser;
        try {
            anilistUser = Helpers.isNumber(query) ?
                await AnilistAPI.fetchUserById(parseInt(query)) : await AnilistAPI.fetchUserByName(query);
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('No se ha encontrado el usuario proporcionado en anilist.');
            }
        }

        await DB.createUser(serverId, userId, anilistUser.getId()+'');
        await bot.loadServers();

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Te has registrado con éxito.')
            .obtenerDatos();

        await this.interaction.editReply({
            embeds: [embed]
        })
    }
}