import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Helpers from "../../../Helpers";
import NoResultsException from "../../../../errores/NoResultsException";
import EmbedVisualNovel from "../../../embeds/EmbedVisualNovel";
import VisualNovel from "../../../apis/vndb/modelos/VisualNovel";
import VisualNovelDatabaseAPI from "../../../apis/vndb/VisualNovelDatabaseAPI";

export default class VNCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const query: string = this.interaction.options.getString('nombre-o-id') as string;
        const translate: boolean = this.interaction.options.getBoolean('traducir') || false;

        const queryType = Helpers.isNumber(query) ? 'id' : 'search';

        const result = await VisualNovelDatabaseAPI.obtenerPrimerResultado(queryType, query);
        if (!result) throw new NoResultsException('No se han encontrado resultados.');

        const vn = new VisualNovel(result);
        const embed = translate ? await EmbedVisualNovel.CreateTranslated(vn) : EmbedVisualNovel.Create(vn);

        this.interaction.editReply({ embeds: [embed] });
    }
} 