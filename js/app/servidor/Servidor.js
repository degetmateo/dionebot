"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Bot_1 = __importDefault(require("../bot/Bot"));
const DB_1 = __importDefault(require("../database/DB"));
class Servidor {
    constructor(puerto) {
        this.puerto = puerto;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static(path_1.default.join(__dirname + '/../../public')));
        this.app.set("port", process.env.PORT || 4000);
        this.cargarRutas();
        this.bot = new Bot_1.default();
        this.db = new DB_1.default();
        this.escuchar();
    }
    static Iniciar(puerto) {
        new Servidor(puerto);
    }
    cargarRutas() {
        this.app.get("/", (req, res) => {
            res.sendFile(path_1.default.join(__dirname + "/../../public/views/index.html"));
        });
        this.app.get("/invitar", (req, res) => {
            res.redirect(process.env.ENLACE_INVITACION || "");
        });
    }
    async escuchar() {
        this.app.listen(this.puerto, () => console.log('✅ | Servidor iniciado en el puerto: ' + this.puerto));
        await this.db.connect(process.env.DB);
        this.bot.start(process.env.TOKEN);
    }
}
exports.default = Servidor;
