export const PeoplesQueries = {
  GetPeoples: `
    SELECT
      id,
        name,
        sequence
    FROM kasper_assignment.people as p 
    ORDER BY sequence ASC
    `,

  GetMaxId: `
    SELECT
     IFNULL(
      (SELECT
         id 
      FROM kasper_assignment.people as p 
      ORDER BY id DESC LIMIT 1),
     0) as max_index_number
    `,

  GetPersonById: `
    SELECT
      id,
        name,
        sequence
    FROM kasper_assignment.people as p
    WHERE
      id = ?
    `,

  AddPerson: `
    INSERT INTO kasper_assignment.people (name, sequence)
      VALUES (?, ?);
    `,

  UpdatePersonById: `
    UPDATE kasper_assignment.people
    SET name = ?,
        sequence = ?
    WHERE
      id = ?
    `,

  DeletePersonById: `
    DELETE from kasper_assignment.people
    WHERE
      id = ?
    `,

  GetOrderedData: `
    SELECT *,
      ROW_NUMBER() OVER (ORDER BY sequence) as newSequence 
      FROM kasper_assignment.people
      `,

  UpdateOrderByID: `
    UPDATE kasper_assignment.people
    SET sequence = ?
    WHERE
      id = ?
    `,
};
