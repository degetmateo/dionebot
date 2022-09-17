class Obra {
    private media: any;

    constructor(media: any) {
        this.media = media;
    }

    public getID(): string {
        return this.media.id == null ? "?" : this.media.id.toString();
    }

    public getMalID(): string {
        return this.media.idMal == null ? "?" : this.media.idMal.toString();
    }

    public getFormato(): string {
        return this.media.format == null ? "?" : this.media.format.toString();
    }

    public getGeneros(): Array<string> {
        return this.media.genres == null ? ["?"] : this.media.genres;
    }

    public getTipo(): string {
        return this.media.type == null ? "?" : this.media.type.toString();
    }

    public getFavoritos(): string {
        return this.media.favourites == null ? "?" : this.media.favourites.toString();
    }

    public getPopularidad(): string {
        return this.media.popularity == null ? "?" : this.media.popularity.toString();
    }

    public getEstado(): string {
        return this.media.status == null ? "?" : this.media.status.toString();
    }

    public getEpisodios(): string {
        return this.media.episodes == null ? "?" : this.media.episodes.toString();
    }

    public getTemporada(): string {
        return this.media.season == null ? "?" : this.media.season.toString();
    }

    public getAnioEmision(): string {
        return this.media.seasonYear == null ? "?" : this.media.seasonYear.toString();
    }

    public getDuracion(): string {
        return this.media.duration == null ? "?" : this.media.duration.toString();
    }

    public getCapitulos(): string {
        return this.media.chapters == null ? "?" : this.media.chapters.toString();
    }

    public getVolumenes(): string {
        return this.media.volumes == null ? "?" : this.media.volumes.toString();
    }

    public getPromedio(): string {
        return this.media.meanScore == null ? "?" : this.media.meanScore.toString();
    }

    public getURL(): string {
        return this.media.siteUrl == null ? "?" : this.media.siteUrl.toString();
    }

    public getTitulos(): { romaji: string, english: string, native: string } {
        if (!this.media.title) {
            return { romaji: "?", english: "?", native: "?" }
        }

        if (!this.media.title.romaji) {
            this.media.title.romaji = "?";
        }

        if (!this.media.title.english) {
            this.media.title.english = "?";
        }

        if (!this.media.title.native) {
            this.media.title.native = "?";
        }

        return this.media.title;
    }

    public getDescripcion(): string {
        return this.media.description == null ? "?" : this.media.description.trim()
            .split("<br>").join("")
            .split("</br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("")
            .split("&ldquo;").join("*")
            .split("&rdquo;").join("*")
            .split("&rsquo;").join("'");
    }

    public getCoverImageURL(): string {
        return this.media.coverImage.extraLarge == null ? "?" : this.media.coverImage.extraLarge.toString();
    }
}

export { Obra };