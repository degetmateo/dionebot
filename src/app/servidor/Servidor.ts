import express from 'express';
import path from 'path';
import Bot from '../bot/Bot';
import DB from '../database/DB';

export default class Servidor {
    private puerto: number;
    private app: express.Express;

    private bot: Bot;
    private db: DB;

    private constructor (puerto: number) {
        this.puerto = puerto;
        this.app = express();

        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname + '/../../public')));
        this.app.set("port", process.env.PORT || 4000);

        this.cargarRutas();

        this.bot = new Bot();
        this.db = new DB();

        this.escuchar();
    }

    public static Iniciar (puerto: number): void {
        new Servidor(puerto);
    }

    private cargarRutas ():void {
        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(__dirname + "/../../public/views/index.html"));
        });
        
        this.app.get("/invitar", (req, res) => {
            res.redirect(process.env.ENLACE_INVITACION || "");
        })
        
        this.app.get('/anilist/login/', (req, res) => {
            const codigo = req.query.code;
            //AnilistAPI.obtenerTokenDeAcceso(codigo as string);
            console.log(req.query.code);
            res.redirect('/');
        })
    }

    private async escuchar (): Promise<void> {
        this.app.listen(this.puerto, () => console.log('✅ | Servidor iniciado en el puerto: ' + this.puerto));
        await this.db.conectar(process.env.DB);
        this.bot.iniciar(process.env.TOKEN);
    }
}