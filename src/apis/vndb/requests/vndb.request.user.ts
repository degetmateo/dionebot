import vndb from "../vndb";

const vndbRequestUser = async (user: {
    id: string;
    token: string;
}) => {
    const uri = `https://api.vndb.org/kana/user?q=${user.id}&fields=lengthvotes,lengthvotes_sum`;
    
    const options = {
        method: "GET",
        headers: {
            "Authorization": "token " + user.token
        }
    };

    return await vndb.request(uri, options);
};

export default vndbRequestUser;