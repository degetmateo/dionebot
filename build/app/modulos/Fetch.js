"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class Fetch {
    static async request(query, variables) {
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables })
        };
        const data = await (0, node_fetch_1.default)(this.url, opciones);
        const res = await data.json();
        if (!res || !res.data)
            return null;
        return res.data;
    }
}
exports.Fetch = Fetch;
Fetch.url = "https://graphql.anilist.co";
