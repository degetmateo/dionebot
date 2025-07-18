import { Client, Collection, GatewayIntentBits, SlashCommandBuilder } from "discord.js";

export default class Bot extends Client<true> {
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
    };
};