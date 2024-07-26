import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import NoResultsException from "../../../errors/NoResultsException";
import Helpers from "../../Helpers";
import VisualNovelDatabaseAPI from "../../apis/vndb/VisualNovelDatabaseAPI";
import VisualNovel from "../../apis/vndb/modelos/VisualNovel";
import EmbedVisualNovel from "../../embeds/EmbedVisualNovel";

export default class VNCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const query: string = this.interaction.options.getString('name-or-id') as string;

        const queryType = Helpers.isNumber(query) ? 'id' : 'search';

        const result = await VisualNovelDatabaseAPI.obtenerPrimerResultado(queryType, query);
        if (!result) throw new NoResultsException('No se han encontrado resultados.');

        const vn = new VisualNovel(result);
        const embed = EmbedVisualNovel.Create(vn);

        try {
            await this.interaction.editReply({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }
} 