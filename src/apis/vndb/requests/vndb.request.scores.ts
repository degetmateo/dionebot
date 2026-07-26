import vndb from "../vndb";

const vndbRequestScores = async (members: Array<{
    userId: string;
    username:string;
    userToken: string;
    vnId: string;
}>) => {
    const scores: Array<{
        id: string;
        username: string;
        vote: number;
        status: string;
    }> = [];

    for (const member of members) {
        try {
            const scoreRequest: any = await vndb.score({
                userId: member.userId,
                userToken: member.userToken,
                vnId: member.vnId
            });
    
            const results: Array<{
                id: string;
                vote: number;
                labels: Array<{ id: number; label: string; }>;
            }> = scoreRequest.results;
    
            const score = results[0];
            if (!score) continue;
    
            const statusMap: any = {
                1: "PLAYING",
                2: "FINISHED",
                3: "PAUSED",
                4: "DROPPED",
                5: "SIN ASIGNAR",
            };
    
            const label = score.labels.find(l => l.id <= 4);
            const status = label ?
                statusMap[label.id] :
                "UNKNOWN";       
    
            scores.push({
                id: member.userId,
                username: member.username,
                vote: Number(score.vote),
                status: status
            });
        } catch (error) {
            console.error(error);
            continue;
        };
    };

    return scores;
};

export default vndbRequestScores;