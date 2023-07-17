import { MediaList } from "../apis/anilist/types/MediaList";

export default class Notas {
    private completado: ListaNotas;
    private progreso: ListaNotas;
    private pausado: ListaNotas;
    private dropeado: ListaNotas;
    private planificado: ListaNotas;

    constructor (completado: ListaNotas, progreso: ListaNotas, dropeado: ListaNotas, planificado: ListaNotas, pausado: ListaNotas) {
        this.completado = completado;
        this.progreso = progreso;
        this.dropeado = dropeado;
        this.planificado = planificado;
        this.pausado = pausado;
    }

    public hayNotas (): boolean {
        return (this.completado.length > 0 ||
                this.progreso.length > 0 ||
                this.pausado.length > 0 ||
                this.dropeado.length > 0 ||
                this.planificado.length > 0);
    }

    public obtenerCompletado () {
        return this.completado;
    }

    public obtenerProgreso () {
        return this.progreso;
    }

    public obtenerPausado () {
        return this.pausado;
    }

    public obtenerDropeado () {
        return this.dropeado;
    }

    public obtenerPlanificado () {
        return this.planificado;
    }
}

type ListaNotas = Array<MediaList>;