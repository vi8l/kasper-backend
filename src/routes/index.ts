"use strict";

import { Router, Request, Response } from "express";
import { PeopleController } from "../controller";
const peopleController = new PeopleController();
const router = Router();

router.get("/people", async (request: Request, response: Response) => {
    response.send(await peopleController.getPeoples())
});

router.get("/people/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.getPersonByID(+request.params.id))
});

router.post("/people", async (request: Request, response: Response) => {
    response.send(await peopleController.addPerson(request))
});

router.put("/people/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.updatePersonNameById(request))
});

router.put("/people/sequence/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.updateOrderByID(request))
});

router.delete("/people/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.deletePersonById(+request.params.id))
});

export default router;
