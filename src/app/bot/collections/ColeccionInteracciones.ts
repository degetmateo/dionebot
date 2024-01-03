export default class ColeccionInteracciones {
    private interacciones: Set<string>;
    
    private constructor (interacciones: Set<string>) {
        this.interacciones = interacciones;
    }

    public static CrearNueva (): ColeccionInteracciones {
        return new ColeccionInteracciones(new Set<string>());
    }

    public vaciar (): void {
        this.interacciones = new Set<string>();
    }

    public existe (interaccion: string): boolean {
        return this.interacciones.has(interaccion);
    }

    public agregar (interaccion: string): void {
        this.interacciones.add(interaccion);
    }

    public eliminar (interaccion: string): void {
        this.interacciones.delete(interaccion);
    }
}