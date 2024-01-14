import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import { Platform } from "./types";
import IllegalArgumentException from "../../../../errores/IllegalArgumentException";
import GenericException from "../../../../errores/GenericException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import Helpers from "../../../Helpers";
import ServerModel from "../../../../database/modelos/ServerModel";
import Embed from "../../../embeds/Embed";

export default class SetupCommandInteraction extends CommandInteraction {
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
        
        if (registeredUsers.find(user => user.discordId === userId)) {
            throw new GenericException('Ya te encuentras registrado.');
        }

        const anilistUser = Helpers.isNumber(query) ?
            await AnilistAPI.fetchUserById(parseInt(query)) : await AnilistAPI.fetchUserByName(query);

        let server = await ServerModel.findOne({ id: serverId });

        if (!server) server = new ServerModel({
            id: serverId,
            premium: false,
            users: []
        });

        server.users.push({ discordId: userId, anilistId: anilistUser.getId() });
        await server.save();

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