import { UserStatsProfile } from 'anilist-node';
import Helpers from '../../helpers';
import { ColorResolvable } from 'discord.js';

export default class Usuario {
    private usuario: UserStatsProfile;
    
    constructor (usuario: UserStatsProfile) {
        this.usuario = usuario;
    }

    public obtenerID (): number {
        return this.usuario.id;
    }

    public obtenerURL (): string {
        return this.usuario.siteUrl;
    }

    public obtenerNombre (): string {
        return this.usuario.name;
    }

    public obtenerBio (): string {
        return Helpers.eliminarEtiquetasHTML(this.usuario.about);
    }

    public obtenerAvatarURL (): string {
        return this.usuario.avatar.large || this.usuario.avatar.medium;
    }

    public obtenerBannerURL (): string {
        return this.usuario.bannerImage;
    }

    public obtenerColor (): ColorResolvable {
        return this.usuario.options.profileColor as ColorResolvable;
    }
}