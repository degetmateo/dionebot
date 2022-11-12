"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("dotenv").config();
var express_1 = __importDefault(require("express"));
var bot_1 = __importDefault(require("./main/bot"));
var app = (0, express_1["default"])();
var bot = new bot_1["default"]();
app.set("port", process.env.PORT || 4000);
app.get("/", function (req, res) {
    res.send("que lees puta");
});
app.listen(app.get("port"), function () {
    console.log("Servidor iniciado en el puerto: ".concat(app.get("port")));
    bot.iniciar();
});
