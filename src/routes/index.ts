"use strict";

import { Router, Request, Response } from "express";
import { PeopleController } from "../controller";
const peopleController = new PeopleController();
const router = Router();

router.get("/user", async (request: Request, response: Response) => {
    response.send(await peopleController.getPeoples())
});

router.get("/user/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.getPersonById(+request.params.id))
});

router.post("/user", async (request: Request, response: Response) => {
    response.sendStatus(200).send(await peopleController.addPerson(request))
});

router.post("/user/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.updatePersonById(request))
});

router.delete("/user/:id", async (request: Request, response: Response) => {
    response.send(await peopleController.deletePersonById(+request.params.id))
});

export default router;
