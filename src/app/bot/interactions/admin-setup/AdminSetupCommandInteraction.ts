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
import { Platform } from "../setup/types";
import Embed from "../../embeds/Embed";

export default class AdminSetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        // await this.interaction.deferReply({ ephemeral: true });

        const platform = this.interaction.options.getString('plataforma') as Platform;
        const user = this.interaction.options.getUser('usuario');
        const query = this.interaction.options.getString('nombre-o-id');

        if (platform === 'MyAnimeList' || platform === 'VisualNovelDatabase') {
            throw new IllegalArgumentException('La plataforma que has elegido no se encuentra disponible.');
        }

        const bot = this.interaction.client as Bot;
        const serverId = this.interaction.guildId;

        const registeredUsers = bot.servers.getUsers(serverId);
        
        if (registeredUsers.find(u => u.discordId === user.id)) {
            throw new GenericException('El usuario ingresado ya se encuentra registrado.');
        }

        let anilistUser: AnilistUser;

        try {
            anilistUser = Helpers.isNumber(query) ?
                await AnilistAPI.fetchUserById(parseInt(query)) : await AnilistAPI.fetchUserByName(query);            
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('No se ha encontrado al usuario ingresado en anilist.')
            }
        }

        await DB.createUser(serverId, user.id, anilistUser.getId()+'');
        await bot.loadServers();

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Se ha registrado al usuario con éxito.')
            .obtenerDatos();

        await this.interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}