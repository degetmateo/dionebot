import express from 'express';
import path from 'path';
import Bot from '../bot/Bot';
import DB from '../database/DB';

import Aniuser from '../database/modelos/Aniuser';
import ServerModel from '../database/modelos/ServerModel';

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

        // this.CopyDatabase();
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
    }

    private async escuchar (): Promise<void> {
        this.app.listen(this.puerto, () => console.log('✅ | Servidor iniciado en el puerto: ' + this.puerto));
        await this.db.connect(process.env.DB as string);
        this.bot.iniciar(process.env.TOKEN);
    }

    // private async CopyDatabase (): Promise<void> {
    //     const aniusers = await Aniuser.find();
        
    //     for (const user of aniusers) {
    //         const server = await ServerModel.findOne({ id: user.serverId });
    //         const userData = {
    //             discordId: user.discordId,
    //             anilistId: user.anilistId
    //         }
            
    //         if (!server) {
    //             const Server = new ServerModel({
    //                 id: user.serverId,
    //                 premium: false,
    //                 users: [userData]
    //             })

    //             await Server.save();
    //         } else {
    //             server.users.push(userData);
    //             await server.save();
    //         }
    //     }
    // }
}