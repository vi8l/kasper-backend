import { Request, RequestHandler, Response } from "express";
import { PeopleModel } from "../model/people.model";
import { PeopleService } from "../service/index";

export class PeopleController {
  public peopleService: PeopleService = new PeopleService();

  /**
   * Get all PEOPLES records
   */
  public async getPeoples() {
    try {
      return await this.peopleService.getPeoples();
    } catch (error) {}
  }

  /**
   * Get person record based on id provided
   *
   * @param id person ID
   */
  public async getPersonByID(id: number) {
    try {
      return this.peopleService.getPersonByID(id);
    } catch (error) {}
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
      return this.peopleService.addPerson(person);
    } catch (error) {
      console.log("results", error);
    }
  }

  private async validateRequest(req: Request, update: boolean = false) {
    if (!req?.body?.name || (update && !req?.params?.id)) {
      throw new Error("Invalid request");
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
      await this.peopleService.updatePersonNameById(person);
      return "Success";
    } catch (error) {
      console.log(error)
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
      console.log("sequenceNumber>>", sequenceNumber);
      await this.peopleService.updateOrderByID(+id, sequenceNumber);
      await this.reorderPeopleSequence(req, sequenceNumber);
      return "Success";
    } catch (error) {}
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
        const orderedData = await this.peopleService.getOrderedData();
        await Promise.all(
          orderedData.map(async (person: { [key: string]: any }) => {
            await this.peopleService.updateOrderByID(
              person.id,
              person.newSequence * 1024
            );
          })
        );
      }
      return;
    } catch (error) {}
  }

  /**
   * deletes a person
   *
   * @param id Person ID
   */
  public async deletePersonById(id: number) {
    try {
      if (id) {
        await this.peopleService.deletePerson(id);
      }
      return "Success";
    } catch (error) {}
  }
}
