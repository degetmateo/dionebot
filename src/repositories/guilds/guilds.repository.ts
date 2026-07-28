import guildsRepositoryFindsert from "./guilds.repository.findsert";
import guildsRepositoryUpdateAffinityTop from "./guilds.repository.update.affinityTop";

const guildsRepository = {
    update: {
        affinityTop: guildsRepositoryUpdateAffinityTop
    },
    findsert: guildsRepositoryFindsert
};

export default guildsRepository;