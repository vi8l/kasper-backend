import { DB_CONFIGS } from '../configs/db_configs';
const db_name = DB_CONFIGS.mySqlDbConfigs.DB_DATABASE;
export const PeoplesQueries = {
  GetPeoples: `
    SELECT
      id,
        name,
        sequence
    FROM ${db_name}.people as p 
    ORDER BY sequence ASC
    `,

  GetMaxId: `
    SELECT
     IFNULL(
      (SELECT
         id 
      FROM ${db_name}.people as p 
      ORDER BY id DESC LIMIT 1),
     0) as max_index_number
    `,

  GetPersonById: `
    SELECT
      id,
        name,
        sequence
    FROM ${db_name}.people as p
    WHERE
      id = ?
    `,

  AddPerson: `
    INSERT INTO ${db_name}.people (name, sequence)
      VALUES (?, ?);
    `,

  UpdatePersonNameById: `
    UPDATE ${db_name}.people
    SET name = ?
    WHERE
      id = ?
    `,

  DeletePersonById: `
    DELETE from ${db_name}.people
    WHERE
      id = ?
    `,

  GetOrderedData: `
    SET @row_number = 0;
    SELECT *,
        (@row_number:=@row_number + 1) AS newSequence
    FROM
    ${db_name}.people
      `,

  UpdateOrderByID: `
    UPDATE ${db_name}.people
    SET sequence = ?
    WHERE
      id = ?
    `,
};
