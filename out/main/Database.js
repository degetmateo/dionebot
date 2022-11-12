"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DB = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var DB = /** @class */ (function () {
    function DB() {
    }
    DB.prototype.conectar = function (url) {
        mongoose_1["default"].connect(url)
            .then(function () { return console.log("DB Iniciada."); })["catch"](function (err) { return console.error(err); });
    };
    return DB;
}());
exports.DB = DB;
