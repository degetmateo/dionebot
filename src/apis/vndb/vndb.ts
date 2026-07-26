import GenericError from "../../errors/genericError";
import { codes } from "../../static/codes";
import vndbRequestScore from "./requests/vndb.request.score";
import vndbRequestScores from "./requests/vndb.request.scores";
import vndbRequestUser from "./requests/vndb.request.user";
import vndbRequestVn from "./requests/vndb.request.vn";

const auth = async (token: string): Promise<{
    id: string;
    username: string;
    permissions: Array<string>;
}> => {
    const uri = 'https://api.vndb.org/kana/authinfo';
    return await request(uri, {
        method: "GET",
        headers: {
            "Authorization": "token " + token
        }
    }) as any;
};

const request = async (uri: string, options: RequestInit) => {
    try {
        const req = await fetch(uri, options);
        const res = await req.json();

        if (!req.ok) {
            if (codes[req.status]) throw new GenericError(codes[req.status]);
            else throw res
        };

        return res;
    } catch (error) {
        console.error(error);
        if (error instanceof GenericError) throw error;
        else throw new GenericError();
    };
};

const vndb = {
    request,
    auth,
    score: vndbRequestScore,
    scores: vndbRequestScores,
    user: vndbRequestUser,
    vn: vndbRequestVn
};

export default vndb;