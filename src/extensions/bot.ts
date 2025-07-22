import { Client, Collection, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import CommandsHandler from "../handlers/commandsHandler";
import EventsHandler from "../handlers/eventsHandler";

export default class Bot extends Client<true> {
    public commandsHandler: CommandsHandler;
    public eventsHandler: EventsHandler;

    public commands: Collection<string, {
        cooldown: number;
        data: SlashCommandBuilder,
        execute: Function
    }>;

    public cooldowns: Collection<string, Collection<string, any>>;

    constructor () {
        super({
            intents: [GatewayIntentBits.Guilds]
        });

        this.commands = new Collection();
        this.cooldowns = new Collection();

        this.commandsHandler = new CommandsHandler(this);
        this.eventsHandler = new EventsHandler(this);

        this.commandsHandler.load();
        this.eventsHandler.load();
    };
};