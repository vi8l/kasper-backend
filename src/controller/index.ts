import { Request, RequestHandler, Response } from "express";
import { PeopleModel } from "../model/people.model";
import { PeopleService } from "../service/index";
import CustomExceptionError from "../error/custom-exception.error";
import { CustomResponseModel } from "../model/custom-response.model";

export class PeopleController {
  public peopleService: PeopleService = new PeopleService();

  /**
   * Get all PEOPLES records
   */
  public async getPeoples() {
    try {
      return this.peopleService.getPeoples();
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  /**
   * Get person record based on id provided
   *
   * @param id person ID
   */
  public async getPersonByID(id: number) {
    try {
      const response = await this.peopleService.getPersonByID(id);
      if (!response || response.length <= 0) {
        throw new CustomExceptionError(
          "Person not found",
          "NOT_FOUND_ERROR",
          404
        );
      }
      return response[0];
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  /**
   * Inserts a new person record
   * Set sequence value to MaxID * 1024 into VALUES
   * @param req Express Request
   */
  public async addPerson(req: Request) {
    try {
      this.validateRequest(req);

      // if there is no data in the table, return 0
      const results = await this.peopleService.getMaxID();

      const maxID = results[0].max_index_number + 1;
      const person = new PeopleModel({
        name: req?.body?.name,
        sequence: maxID * 1024 || 1024,
      });
      const result = await this.peopleService.addPerson(person);
      if (!result) {
        throw new CustomExceptionError(
          "Can not add person",
          "INVALID_REQUEST",
          400
        );
      }
      return new CustomResponseModel({
        message: "Data added successfully.",
      });
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  /**
   * Updates existing person name
   *
   * @param req
   */
  public async updatePersonNameById(req: Request) {
    try {
      this.validateRequest(req, true);
      const id = req.params.id;
      const person = new PeopleModel({
        name: req.body.name,
        sequence: req.body.sequence,
        id: +id,
      });
      const result = await this.peopleService.updatePersonNameById(person);
      if (!result) {
        throw new CustomExceptionError(
          "Person not found",
          "NOT_FOUND_ERROR",
          404
        );
      }

      return new CustomResponseModel({
        message: "Data updated successfully.",
      });
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  /**
   * Updates existing person order
   *
   * @param req
   */
  public async updateOrderByID(req: Request) {
    try {
      this.validateRequest(req, true);
      const id = req.params.id;
      const sequenceNumber = this.getNewSquenceNumber(req);
      const result = await this.peopleService.updateOrderByID(
        +id,
        sequenceNumber
      );
      if (!result) {
        throw new CustomExceptionError(
          "Person not found",
          "NOT_FOUND_ERROR",
          404
        );
      }
      await this.reorderPeopleSequence(req, sequenceNumber);
      return new CustomResponseModel({
        message: "Data updated successfully.",
      });
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  /**
   * deletes a person
   *
   * @param id Person ID
   */
  public async deletePersonById(id: number) {
    try {
      if (!id) {
        throw new CustomExceptionError(
          "Invalid request",
          "INVALID_REQUEST",
          400
        );
      }
      const result = await this.peopleService.deletePerson(id);
      if (!result) {
        throw new CustomExceptionError(
          "Person not found",
          "NOT_FOUND_ERROR",
          404
        );
      }
      return new CustomResponseModel({
        message: "Data deleted successfully.",
      });
    } catch (error: any) {
      throw new CustomExceptionError(
        error.message || "",
        error?.errorCode || "INVALID_REQUEST",
        error?.httpStatus || 400
      );
    }
  }

  private validateRequest(req: Request, update: boolean = false) {
    if (!req?.body?.name || (update && !req?.params?.id)) {
      throw new CustomExceptionError("Invalid request", "INVALID_REQUEST", 400);
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

  private getNewSquenceNumber(req: Request) {
    let prevSequenceNumber = req.body.prevSequenceNumber;
    let nextSequenceNumber = req.body.nextSequenceNumber;
    let currSequenceNumber;

    if (prevSequenceNumber === undefined) {
      currSequenceNumber = Math.floor(
        nextSequenceNumber - nextSequenceNumber / 2
      );
    } else if (nextSequenceNumber === undefined) {
      currSequenceNumber = Math.floor(
        prevSequenceNumber + prevSequenceNumber / 2
      );
    } else {
      currSequenceNumber = Math.floor(
        (prevSequenceNumber + nextSequenceNumber) / 2
      );
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
  private async reorderPeopleSequence(
    req: Request,
    currSequenceNumber: number
  ) {
    try {
      const prevSequenceNumber = req.body.prevSequenceNumber;
      const nextSequenceNumber = req.body.nextSequenceNumber;
      if (
        Math.abs(currSequenceNumber - prevSequenceNumber) <= 1 ||
        Math.abs(currSequenceNumber - nextSequenceNumber) <= 1
      ) {
        const orderedData = await this.peopleService.getPeoples();
        await Promise.all(
          orderedData.map(
            async (person: { [key: string]: any }, key: number) => {
              await this.peopleService.updateOrderByID(
                person.id,
                (key + 1) * 1024
              );
            }
          )
        );
      }
      return;
    } catch (error) {
      throw new CustomExceptionError(error as string, "INVALID_REQUEST", 400);
    }
  }
}
