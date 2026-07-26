import Helpers from "../../../helpers";
import vndb from "../vndb";
import { T_VN } from "../vndbTypes";

const vndbRequestVn = async (args: string): Promise<{
    more: boolean;
    results: Array<T_VN>;
}> => {
    const uri = 'https://api.vndb.org/kana/vn';
    return await vndb.request(uri, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "results": 5,
            "page": 1,
            "filters": [Helpers.isNumber(args) ? "id" : "search", "=", args],
            "fields": `
                    title, 
                    aliases, 
                    olang, 
                    devstatus,
                    released,
                    languages,
                    platforms,
                    length_votes,
                    length_minutes,
                    description,
                    average,
                    rating,
                    votecount,
                    image.url,
                    image.thumbnail,
                    image.sexual,
                    image.violence,
                    tags.name,
                    screenshots.url,
                    screenshots.votecount,
                    screenshots.sexual,
                    screenshots.violence
                `
        })
    }) as any;
};

export default vndbRequestVn;