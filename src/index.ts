/// <reference path="../env.d.ts" />

import Bot from './extensions/bot.extension';
import mongo from "./database/mongo";
import GachaSchedulerModule from './modules/gacha.scheduler.module';
import { TOKEN } from './consts';

const init = async () => {
    await mongo.init();

    const bot = new Bot();
    await bot.login(TOKEN);

    GachaSchedulerModule.SCHEDULE_PULLS_RESET(bot);
};

init();