export default class Notas {
    private completado: ListaNotas;
    private progreso: ListaNotas;
    private dropeado: ListaNotas;
    private planificado: ListaNotas;

    constructor (completado: ListaNotas, progreso: ListaNotas, dropeado: ListaNotas, planificado: ListaNotas) {
        this.completado = completado;
        this.progreso = progreso;
        this.dropeado = dropeado;
        this.planificado = planificado;
    }

    public obtenerCompletado () {
        return this.completado;
    }

    public obtenerProgreso () {
        return this.progreso;
    }

    public obtenerDropeado () {
        return this.dropeado;
    }

    public obtenerPlanificado () {
        return this.planificado;
    }
}

type ListaNotas = Array<{ nombre: string, nota: number }>;