import { ChatInputCommandInteraction, Client } from "discord.js";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";
import Bot from "./bot";

export default class BotCommandInteraction extends ChatInputCommandInteraction {
    public client: Bot;

    constructor (client: Client<true>, data: RawInteractionData) {
        super(client, data);
        this.client = client as Bot;
    };
};