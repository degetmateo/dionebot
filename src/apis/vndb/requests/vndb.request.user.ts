import vndb from "../vndb";

const vndbRequestUser = async (user: {
    id: string;
    token: string;
}) => {
    // const uri = `https://api.vndb.org/kana/user?q=${user.id}&fields=lengthvotes,lengthvotes_sum`;
    
    const uri = 'https://api.vndb.org/kana/ulist';

    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Authorization": 'token ' + user.token
        },
        body: JSON.stringify({
            user: user.id,
            filters: [],
            fields: "vote, vn.title, vn.length, vn.tags.name, vn.tags.category",
            results: 100
        })

        // vn.length, vn.developers.name
    };

    return await vndb.request(uri, options);
};

export default vndbRequestUser;