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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleController = void 0;
const people_model_1 = require("../model/people.model");
const index_1 = require("../service/index");
const custom_exception_error_1 = __importDefault(require("../error/custom-exception.error"));
const custom_response_model_1 = require("../model/custom-response.model");
class PeopleController {
    constructor() {
        this.peopleService = new index_1.PeopleService();
    }
    /**
     * Get all PEOPLES records
     */
    getPeoples() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.peopleService.getPeoples();
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    /**
     * Get person record based on id provided
     *
     * @param id person ID
     */
    getPersonByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.peopleService.getPersonByID(id);
                if (!response || response.length <= 0) {
                    throw new custom_exception_error_1.default("Person not found", "NOT_FOUND_ERROR", 404);
                }
                return response[0];
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    /**
     * Inserts a new person record
     * Set sequence value to MaxID * 1024 into VALUES
     * @param req Express Request
     */
    addPerson(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateRequest(req);
                // if there is no data in the table, return 0
                const results = yield this.peopleService.getMaxID();
                const maxID = results[0].max_index_number + 1;
                const person = new people_model_1.PeopleModel({
                    name: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name,
                    sequence: maxID * 1024 || 1024,
                });
                const result = yield this.peopleService.addPerson(person);
                if (!result) {
                    throw new custom_exception_error_1.default("Can not add person", "INVALID_REQUEST", 400);
                }
                return new custom_response_model_1.CustomResponseModel({
                    message: "Data added successfully.",
                });
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    /**
     * Updates existing person name
     *
     * @param req
     */
    updatePersonNameById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateRequest(req, true);
                const id = req.params.id;
                const person = new people_model_1.PeopleModel({
                    name: req.body.name,
                    sequence: req.body.sequence,
                    id: +id,
                });
                const result = yield this.peopleService.updatePersonNameById(person);
                if (!result) {
                    throw new custom_exception_error_1.default("Person not found", "NOT_FOUND_ERROR", 404);
                }
                return new custom_response_model_1.CustomResponseModel({
                    message: "Data updated successfully.",
                });
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    /**
     * Updates existing person order
     *
     * @param req
     */
    updateOrderByID(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateRequest(req, true);
                const id = req.params.id;
                const sequenceNumber = this.getNewSquenceNumber(req);
                const result = yield this.peopleService.updateOrderByID(+id, sequenceNumber);
                if (!result) {
                    throw new custom_exception_error_1.default("Person not found", "NOT_FOUND_ERROR", 404);
                }
                yield this.reorderPeopleSequence(req, sequenceNumber);
                return new custom_response_model_1.CustomResponseModel({
                    message: "Data updated successfully.",
                });
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    /**
     * deletes a person
     *
     * @param id Person ID
     */
    deletePersonById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new custom_exception_error_1.default("Invalid request", "INVALID_REQUEST", 400);
                }
                const result = yield this.peopleService.deletePerson(id);
                if (!result) {
                    throw new custom_exception_error_1.default("Person not found", "NOT_FOUND_ERROR", 404);
                }
                return new custom_response_model_1.CustomResponseModel({
                    message: "Data deleted successfully.",
                });
            }
            catch (error) {
                throw new custom_exception_error_1.default(error.message || "", (error === null || error === void 0 ? void 0 : error.errorCode) || "INVALID_REQUEST", (error === null || error === void 0 ? void 0 : error.httpStatus) || 400);
            }
        });
    }
    validateRequest(req, update = false) {
        var _a, _b;
        if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.name) || (update && !((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id))) {
            throw new custom_exception_error_1.default("Invalid request", "INVALID_REQUEST", 400);
        }
    }
    /**
     * prevSequenceNumber: sequence of the above person, could be undefined
     * nextSequenceNumber: sequence of the below person, could be undefined
     *
     * prevSequenceNumber === undefined ? (nextSequenceNumber-(nextSequenceNumber/2))
     * nextSequenceNumber === undefined ? (prevSequenceNumber + (prevSequenceNumber/2))
     * currSequenceNumber = (prevSequenceNumber + nextSequenceNumber)/2
     * @param req
     */
    getNewSquenceNumber(req) {
        let prevSequenceNumber = req.body.prevSequenceNumber;
        let nextSequenceNumber = req.body.nextSequenceNumber;
        let currSequenceNumber;
        if (prevSequenceNumber === undefined) {
            currSequenceNumber = Math.floor(nextSequenceNumber - nextSequenceNumber / 2);
        }
        else if (nextSequenceNumber === undefined) {
            currSequenceNumber = Math.floor(prevSequenceNumber + prevSequenceNumber / 2);
        }
        else {
            currSequenceNumber = Math.floor((prevSequenceNumber + nextSequenceNumber) / 2);
        }
        return currSequenceNumber;
    }
    /**
     * If sequence number ovelaps ?
     * Get all sequence number in ascending order from 1~ (= newSequence), then update the table
     * (newSequence*1024)
     * @param req
     * @param currSequenceNumber
     * @returns
     */
    reorderPeopleSequence(req, currSequenceNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prevSequenceNumber = req.body.prevSequenceNumber;
                const nextSequenceNumber = req.body.nextSequenceNumber;
                if (Math.abs(currSequenceNumber - prevSequenceNumber) <= 1 ||
                    Math.abs(currSequenceNumber - nextSequenceNumber) <= 1) {
                    const orderedData = yield this.peopleService.getOrderedData();
                    yield Promise.all(orderedData.map((person) => __awaiter(this, void 0, void 0, function* () {
                        yield this.peopleService.updateOrderByID(person.id, person.newSequence * 1024);
                    })));
                }
                return;
            }
            catch (error) {
                throw new custom_exception_error_1.default(error, "INVALID_REQUEST", 400);
            }
        });
    }
}
exports.PeopleController = PeopleController;
