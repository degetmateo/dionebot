class UsuarioAnilist {
    private data: any;

    constructor(data: any) {
        this.data = data;
    }

    public getData() {
        return this.data;
    }

    public getID(): string {
        return this.data.id == null ? null : this.data.id.toString();
    }

    public getEstadisticas(): any {
        return this.data.statistics == null ? null : this.data.statistics;
    }

    public getColorName(): string {
        return this.data.options.profileColor == null ? "black" : this.data.options.profileColor;
    }

    public getNombre(): string {
        return this.data.name == null ? null : this.data.name;
    }

    public getBio(): string {
        return this.data.about == null ? null : this.data.about;
    }

    public getAvatarURL(): string {
        return this.data.avatar.large == null ? null : this.data.avatar.large;
    }

    public getBannerImage(): string {
        return this.data.bannerImage == null ? null : this.data.bannerImage;
    }

    public getURL(): string {
        return this.data.siteUrl == null ? null : this.data.siteUrl;
    }
}

export { UsuarioAnilist };