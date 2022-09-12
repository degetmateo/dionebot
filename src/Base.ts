class Base {
    public id: String;
    public title: { romaji: String, english: String, native: String };
    public description: String;

    constructor(id: String, title: { romaji: String, english: String, native: String }, description: String) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    public getDescripcion(): String {
        return this.description.trim()
            .split("<br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("");
    }
}

export { Base };