import { PeoplesQueries } from "./queries";
import { execute } from "./../utils/mysql.connector";
import { PeopleModel } from "../model/people.model";

export class PeopleService {
  /**
   * GET all peoples
   */
  public async getPeoples() {
    return execute<PeopleModel[]>(PeoplesQueries.GetPeoples, []);
  }

  /**
   * GET max ID
   */
  public async getMaxID() {
    return execute<any>(PeoplesQueries.GetMaxId, []);
  }

  /**
   * GET a Person by ID
   */
  public async getPersonByID(id: number) {
    return execute<PeopleModel[]>(PeoplesQueries.GetPersonById, [id]);
  }

  /**
   * ADD new person
   */
  public async addPerson(peopleModel: PeopleModel) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.AddPerson,
      [peopleModel.name, peopleModel.sequence]
    );
    return result.affectedRows > 0;
  }

  /**
   * UPDATE person information
   */
  public async updatePersonNameById(peopleModel: PeopleModel) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.UpdatePersonNameById,
      [peopleModel.name, peopleModel.id]
    );
    return result.affectedRows > 0;
  }

  /**
   * DELETE person by ID
   */
  public async deletePerson(id: number) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.DeletePersonById,
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * GET ordered data
   */
  public async getOrderedData() {
    return execute<PeopleModel[]>(PeoplesQueries.GetOrderedData, []);
  }

  /**
   * UPDATE order by ID
   */
  public async updateOrderByID(id: number, sequence: number) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.UpdateOrderByID,
      [sequence, id]
    );
    return result.affectedRows > 0;
  }
}
