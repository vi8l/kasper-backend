"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleService = void 0;
const queries_1 = require("./queries");
const mysql_connector_1 = require("./../utils/mysql.connector");
class PeopleService {
    /**
     * GET all peoples
     */
    getPeoples() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.GetPeoples, []);
        });
    }
    /**
     * GET max ID
     */
    getMaxID() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.GetMaxId, []);
        });
    }
    /**
     * GET a Person by ID
     */
    getPersonByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.GetPersonById, [id]);
        });
    }
    /**
     * ADD new person
     */
    addPerson(peopleModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.AddPerson, [peopleModel.name, peopleModel.sequence]);
            return result.affectedRows > 0;
        });
    }
    /**
     * UPDATE person information
     */
    updatePersonNameById(peopleModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.UpdatePersonNameById, [peopleModel.name, peopleModel.id]);
            return result.affectedRows > 0;
        });
    }
    /**
     * DELETE person by ID
     */
    deletePerson(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.DeletePersonById, [id]);
            return result.affectedRows > 0;
        });
    }
    /**
     * GET ordered data
     */
    getOrderedData() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.GetOrderedData, []);
        });
    }
    /**
     * UPDATE order by ID
     */
    updateOrderByID(id, sequence) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, mysql_connector_1.execute)(queries_1.PeoplesQueries.UpdateOrderByID, [sequence, id]);
            return result.affectedRows > 0;
        });
    }
}
exports.PeopleService = PeopleService;
