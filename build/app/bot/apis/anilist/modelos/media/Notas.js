"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Notas {
    constructor(completado, progreso, dropeado, planificado, pausado) {
        this.completado = completado;
        this.progreso = progreso;
        this.dropeado = dropeado;
        this.planificado = planificado;
        this.pausado = pausado;
    }
    hayNotas() {
        return (this.completado.length > 0 ||
            this.progreso.length > 0 ||
            this.pausado.length > 0 ||
            this.dropeado.length > 0 ||
            this.planificado.length > 0);
    }
    obtenerCompletado() {
        return this.completado;
    }
    obtenerProgreso() {
        return this.progreso;
    }
    obtenerPausado() {
        return this.pausado;
    }
    obtenerDropeado() {
        return this.dropeado;
    }
    obtenerPlanificado() {
        return this.planificado;
    }
}
exports.default = Notas;
