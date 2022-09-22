"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class DB {
    conectar(url) {
        mongoose_1.default.connect(url)
            .then(() => console.log("DB Iniciada."))
            .catch(err => console.error(err));
    }
}
exports.DB = DB;
