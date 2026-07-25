import vndb from "../vndb";

const vndbRequestScore = async (params: {
    userId: string;
    userToken: string;
    vnId: string;
}) => {
    const uri = 'https://api.vndb.org/kana/ulist';
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "token " + params.userToken
        },
        body: JSON.stringify({
            "user": params.userId,
            "fields": "id, vote, notes, started, finished, labels.id, labels.label, vn.title",
            "filters": [ "id", "=", params.vnId ],
        })
    };
    return await vndb.request(uri, options);
};

export default vndbRequestScore;