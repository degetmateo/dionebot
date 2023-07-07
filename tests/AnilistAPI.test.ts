require('dotenv').config();

import AnilistAPI from "../src/app/apis/AnilistAPI";

describe('AnilistAPI', () => {
    const STEINS_GATE_ID = 9253;

    test('obtener anime por id test', async () => {
        const data = await AnilistAPI.obtenerAnimeID(STEINS_GATE_ID);
        expect(data.id).toBe(STEINS_GATE_ID);
    })

    test('obtener anime por busqueda test', async () => {
        const data = (await AnilistAPI.buscarAnime('steins;gate')).media[0]
        expect(data.id).toBe(STEINS_GATE_ID);
    })
})