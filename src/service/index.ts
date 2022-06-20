import { PeoplesQueries } from "./queries";
import { execute } from "./../utils/mysql.connector";
import { PeopleModel } from "../model/people.model";

export class PeopleService {
  /**
   * gets all peoples
   */
  public async getPeoples() {
    return execute<PeopleModel[]>(PeoplesQueries.GetPeoples, []);
  }

  /**
   * gets a Person by ID
   */
  public async getTeamById(id: number) {
    return execute<PeopleModel>(PeoplesQueries.GetPersonById, [id]);
  }

  /**
   * Add new person
   */
  public async addPerson(peopleModel: PeopleModel) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.AddPerson,
      [peopleModel.name, peopleModel.sequence]
    );
    return result.affectedRows > 0;
  }

  /**
   * update person information
   */
  public async updatePerson(peopleModel: PeopleModel) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.UpdatePersonById,
      [peopleModel.name, peopleModel.sequence]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete person by ID
   */
  public async deletePerson(id: number) {
    const result = await execute<{ affectedRows: number }>(
      PeoplesQueries.DeletePersonById,
      [id]
    );
    return result.affectedRows > 0;
  }
}
