import { RateLimitData, RESTEvents } from "discord.js";
import Bot from "../extensions/bot";

module.exports = {
    name: RESTEvents.RateLimited,
    once: false,
    execute: async (bot: Bot, data: RateLimitData) => {
        bot.rateLimited = true;

        setTimeout(() => {
            bot.rateLimited = false;
        }, data.timeToReset);
    }
};