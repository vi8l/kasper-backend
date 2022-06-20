import { Request, RequestHandler, Response } from "express";
import { PeopleModel } from "../model/people.model";

export class PeopleController {
  public static PEOPLES: Array<PeopleModel> = [
    { id: 1, name: "Default User", sequence: 1 },
  ];

  /**
   * Get all PEOPLES records
   */
  public async getPeoples() {
    return PeopleController.PEOPLES;
  }

  /**
   * Get person record based on id provided
   *
   * @param id person ID
   */
  public async getPersonById(id: number) {
    return PeopleController.PEOPLES.find((person) => person.id === id);
  }

  /**
   * Inserts a new person record
   *
   * @param req Express Request
   */
  public async addPerson(req: Request) {
    const lastPersonIndex = PeopleController.PEOPLES.length - 1;
    const lastId = PeopleController.PEOPLES[lastPersonIndex].id;
    const id = lastId + 1;
    const newPerson = new PeopleModel({
      id,
      sequence: id,
      name: req.body.name,
    });
    return PeopleController.PEOPLES.push(newPerson);
  }

  /**
   * Updates existing person record
   *
   * @param req
   */
  public async updatePersonById(req: Request) {
    const currentPerson = PeopleController.PEOPLES.find(
      (person) => person.id === +req.params.id
    );
    if (currentPerson) {
      currentPerson.name = req.body.name || currentPerson.name;
      currentPerson.sequence = req.body.sequence || currentPerson.sequence;
      return { success: true };
    }
    return "No person found";
  }

  /**
   * deletes a person
   *
   * @param id Person ID
   */
  public async deletePersonById(id: number) {
    const personIndex = PeopleController.PEOPLES.findIndex(
      (person) => person.id === id
    );
    PeopleController.PEOPLES.splice(personIndex, 1);
    return PeopleController.PEOPLES;
  }
}
