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
const express_1 = require("express");
const controller_1 = require("../controller");
const peopleController = new controller_1.PeopleController();
const router = (0, express_1.Router)();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get("/people", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.getPeoples());
})));
router.get("/people/:id", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.getPersonByID(+request.params.id));
})));
router.post("/people", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.addPerson(request));
})));
router.put("/people/:id", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.updatePersonNameById(request));
})));
router.put("/people/sequence/:id", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.updateOrderByID(request));
})));
router.delete("/people/:id", asyncHandler((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response.send(yield peopleController.deletePersonById(+request.params.id));
})));
exports.default = router;
