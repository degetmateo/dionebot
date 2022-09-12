"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
class Base {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
    getDescripcion() {
        return this.description.trim()
            .split("<br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("");
    }
}
exports.Base = Base;
