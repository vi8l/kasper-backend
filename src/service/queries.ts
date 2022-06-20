export const PeoplesQueries = {
    GetPeoples: `
    SELECT
      id,
        name,
        sequence
    FROM kasper_assignment.people as p
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
    `
  };