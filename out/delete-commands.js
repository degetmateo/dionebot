"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { REST, Routes } = require('discord.js');
const config_json_1 = require("./config.json");
const token = process.env.TOKEN_BABOSA || "";
const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationGuildCommands(config_json_1.clientId, "625096034317500449"), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);
// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
// const commandsToDelete: Array<string> = ["1041466468312821822", "1041466468312821823", "1041466468312821824", "1041559847956656138"];
// commandsToDelete.forEach((commandId: string) => {
//     console.log(commandId)
//     rest.delete(Routes.applicationCommand(clientId, commandId), { body: [] })
//         .then(() => console.log('Successfully deleted application command'))
//         .catch(console.error);
// })
