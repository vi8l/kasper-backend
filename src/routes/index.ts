"use strict";

import { Router, Request, Response, NextFunction } from "express";
import { PeopleController } from "../controller";
const peopleController = new PeopleController();
const router = Router();
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/people",
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.send(await peopleController.getPeoples());
  })
);

router.get(
  "/people/:id",
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.send(await peopleController.getPersonByID(+request.params.id));
  })
);

router.post(
  "/people",
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.send(await peopleController.addPerson(request));
  })
);

router.put(
  "/people/:id",
  asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.send(await peopleController.updatePersonNameById(request));
    }
  )
);

router.put(
  "/people/sequence/:id",
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.send(await peopleController.updateOrderByID(request));
  })
);

router.delete(
  "/people/:id",
  asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.send(await peopleController.deletePersonById(+request.params.id));
  })
);

export default router;
