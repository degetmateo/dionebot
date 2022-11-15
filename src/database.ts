import mongoose from "mongoose";

class DB {
    public conectar(url: any) {
        mongoose.connect(url)
            .then(() => console.log("DB Iniciada."))
            .catch(err => console.error(err));
    }
}

export { DB };