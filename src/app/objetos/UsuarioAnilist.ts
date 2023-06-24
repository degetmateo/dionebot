class UsuarioAnilist {
    private user: any;

    constructor(user: any) {
        this.user = user;
    }

    public getUserData() {
        return this.user;
    }

    public getID(): string {
        return this.user.id == null ? null : this.user.id.toString();
    }

    public getEstadisticas(): any {
        return this.user.statistics == null ? null : this.user.statistics;
    }

    public getColorName(): string {
        return this.user.options.profileColor == null ? "black" : this.user.options.profileColor;
    }

    public getNombre(): string {
        return this.user.name == null ? null : this.user.name;
    }

    public getBio(): string {
        return this.user.about == null ? null : this.user.about;
    }

    public getAvatarURL(): string {
        return this.user.avatar.large == null ? null : this.user.avatar.large;
    }

    public getBannerImage(): string {
        return this.user.bannerImage == null ? null : this.user.bannerImage;
    }

    public getURL(): string {
        return this.user.siteUrl == null ? null : this.user.siteUrl;
    }
}

export { UsuarioAnilist };