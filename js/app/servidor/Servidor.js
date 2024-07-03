"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Bot_1 = __importDefault(require("../bot/Bot"));
const postgres_1 = __importDefault(require("../database/postgres"));
class Servidor {
    constructor(puerto) {
        try {
            this.puerto = puerto;
            this.app = (0, express_1.default)();
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.static(path_1.default.join(__dirname + '/../../public')));
            this.app.set("port", process.env.PORT || 4000);
            this.cargarRutas();
            this.bot = new Bot_1.default();
            postgres_1.default.init();
            this.escuchar();
        }
        catch (error) {
            console.error(error);
        }
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
        this.bot.start(process.env.TOKEN);
    }
}
exports.default = Servidor;
