import { RateLimitData, RESTEvents } from "discord.js";

module.exports = {
    name: RESTEvents.RateLimited,
    once: false,
    execute: async (data: RateLimitData) => {
        console.log('Rate limit hit!');
        console.log(`Method: ${data.method}`);
        console.log(`Path: ${data.route}`);
        console.log(`Timeout: ${data.timeToReset}ms`);
        console.log(`Global: ${data.global}`);
    }   
};