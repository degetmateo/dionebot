import GenericError from "../errors/genericError";
import Helpers from "../helpers";

export default class AnimeValidator {
    public static validateId (args: any) {
        if (!Helpers.isNumber(args)) throw new GenericError('ID must be a positive number.');
        if (args <= 0) throw new GenericError('ID must be a positive number.');
    };

    public static validateName (args: string) {
        if (!args) throw new GenericError('Debes ingresar el nombre del anime.');
        if (!args.trim()) throw new GenericError('Debes ingresar el nombre del anime.');
    };
};