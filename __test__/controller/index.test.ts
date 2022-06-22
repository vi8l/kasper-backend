import { Request } from "express";
import { PeopleController } from "../../src/controller";
import CustomExceptionError from "../../src/error/custom-exception.error";
import { CustomResponseModel } from "../../src/model/custom-response.model";
import { PeopleModel } from "../../src/model/people.model";

// Under test
const controllerUT = new PeopleController();

afterEach(() => {
  jest.clearAllMocks();
});

const peopleData: PeopleModel[] = [
  {
    name: "test one",
    sequence: 1024,
    id: 1,
  },
  {
    name: "test two",
    sequence: 2048,
    id: 2,
  },
  {
    name: "test three",
    sequence: 3072,
    id: 3,
  },
];

const req = {
  body: {
    name: "Test Person",
    prevSequenceNumber: 1024,
    nextSequenceNumber: 2048,
  },
  params: {
    id: "2",
  },
};

const reorderSequenceReq = {
  body: {
    name: "Test Person",
    prevSequenceNumber: 1024,
    nextSequenceNumber: 1026,
  },
  params: {
    id: "2",
  },
};

const addPersonResponse = new CustomResponseModel({
  message: "Data added successfully.",
});

const canNotAddPersonErrorResponse = new CustomExceptionError(
  "Can not add person",
  "INVALID_REQUEST",
  400
);

const validatePersonErrorResponse = new CustomExceptionError(
  "Invalid request",
  "INVALID_REQUEST",
  400
);

const updatePersonResponse = new CustomResponseModel({
  message: "Data updated successfully.",
});

const personNotFoundErrorResponse = new CustomExceptionError(
  "Person not found",
  "NOT_FOUND_ERROR",
  404
);

describe("People CRUD Operations:", () => {
  describe("Get All Peoples:", () => {
    test("Success", async () => {
      controllerUT.peopleService.getPeoples = jest
        .fn()
        .mockResolvedValue(peopleData);
      const result = await controllerUT.getPeoples();
      expect(result).toBe(peopleData);
    });
  });

  describe("Get person by ID:", () => {
    test("Success", async () => {
      controllerUT.peopleService.getPersonByID = jest
        .fn()
        .mockResolvedValue(peopleData);
      const result = await controllerUT.getPersonByID(1);
      expect(result).toBe(peopleData[0]);
    });

    test("Failed - No person found", async () => {
      try {
        controllerUT.peopleService.getPersonByID = jest
          .fn()
          .mockResolvedValue([]);
        const result = await controllerUT.getPersonByID(1);
      } catch (error) {
        expect(error).toStrictEqual(personNotFoundErrorResponse);
      }
    });
  });

  describe("Add person:", () => {
    test("Success", async () => {
      controllerUT.peopleService.getMaxID = jest
        .fn()
        .mockResolvedValue([{ max_index_number: 1 }]);
      controllerUT.peopleService.addPerson = jest.fn().mockResolvedValue(true);
      const result = await controllerUT.addPerson(req as unknown as Request);
      expect(result).toStrictEqual(addPersonResponse);
    });

    test("Failed - Can not add person error", async () => {
      try {
        controllerUT.peopleService.getMaxID = jest
          .fn()
          .mockResolvedValue([{ max_index_number: 1 }]);
        controllerUT.peopleService.addPerson = jest
          .fn()
          .mockResolvedValue(false);
        await controllerUT.addPerson(req as unknown as Request);
      } catch (error) {
        expect(error).toStrictEqual(canNotAddPersonErrorResponse);
      }
    });

    test("Failed - Validation failed", async () => {
      try {
        controllerUT.peopleService.getMaxID = jest
          .fn()
          .mockResolvedValue([{ max_index_number: 1 }]);
        controllerUT.peopleService.addPerson = jest
          .fn()
          .mockResolvedValue(true);
        await controllerUT.addPerson({ body: {} } as Request);
      } catch (error) {
        expect(error).toStrictEqual(validatePersonErrorResponse);
      }
    });
  });
  describe("Update person name by ID:", () => {
    test("Success", async () => {
      controllerUT.peopleService.updatePersonNameById = jest
        .fn()
        .mockResolvedValue(true);
      const result = await controllerUT.updatePersonNameById(
        req as unknown as Request
      );
      expect(result).toStrictEqual(updatePersonResponse);
    });

    test("Update person name by ID - person not found: Failed", async () => {
      try {
        controllerUT.peopleService.updatePersonNameById = jest
          .fn()
          .mockResolvedValue(false);
        await controllerUT.addPerson(req as unknown as Request);
      } catch (error) {
        expect(error).toStrictEqual(personNotFoundErrorResponse);
      }
    });

    test("Update person name by ID - validation failed: Failed", async () => {
      try {
        controllerUT.peopleService.updatePersonNameById = jest
          .fn()
          .mockResolvedValue(true);
        await controllerUT.addPerson({ body: {} } as Request);
      } catch (error) {
        expect(error).toStrictEqual(validatePersonErrorResponse);
      }
    });
  });
  describe("Update person order by ID:", () => {
    test("Success", async () => {
      controllerUT.peopleService.updateOrderByID = jest
        .fn()
        .mockResolvedValue(true);
      controllerUT.peopleService.getOrderedData = jest
        .fn()
        .mockResolvedValue(peopleData);
      const result = await controllerUT.updateOrderByID(
        req as unknown as Request
      );
      expect(result).toStrictEqual(updatePersonResponse);
    });

    test("Success - Reorder sequence", async () => {
      controllerUT.peopleService.updateOrderByID = jest
        .fn()
        .mockResolvedValue(true);
        controllerUT.peopleService.getPeoples = jest
        .fn()
        .mockResolvedValue(peopleData);
      // controllerUT.peopleService.getOrderedData = jest
      //   .fn()
      //   .mockResolvedValue(peopleData);
      const result = await controllerUT.updateOrderByID(
        reorderSequenceReq as unknown as Request
      );
      expect(result).toStrictEqual(updatePersonResponse);
      expect(controllerUT.peopleService.getPeoples).toBeCalled();
      // first updateOrderByID will be called to update requested record (1) + then reorder all records (peopleData.length)
      expect(controllerUT.peopleService.updateOrderByID).toBeCalledTimes(
        peopleData.length + 1
      );
    });

    test("Failed - Person not found", async () => {
      try {
        controllerUT.peopleService.updateOrderByID = jest
          .fn()
          .mockResolvedValue(false);
        await controllerUT.updateOrderByID(req as unknown as Request);
      } catch (error) {
        expect(error).toStrictEqual(personNotFoundErrorResponse);
      }
    });

    test("Failed - Validation failed", async () => {
      try {
        controllerUT.peopleService.updateOrderByID = jest
          .fn()
          .mockResolvedValue(true);
        await controllerUT.updateOrderByID({ body: {} } as Request);
      } catch (error) {
        expect(error).toStrictEqual(validatePersonErrorResponse);
      }
    });
  });

  describe("Delete person by ID:", () => {
    test("Success", async () => {
      controllerUT.peopleService.deletePerson = jest
        .fn()
        .mockResolvedValue(true);
      const result = await controllerUT.deletePersonById(1);
      expect(result).toBeTruthy();
    });

    test("Failed - No person found", async () => {
      try {
        controllerUT.peopleService.deletePerson = jest
          .fn()
          .mockResolvedValue(false);
        const result = await controllerUT.deletePersonById(1);
      } catch (error) {
        expect(error).toStrictEqual(personNotFoundErrorResponse);
      }
    });

    test("Failed - No ID provided", async () => {
      try {
        controllerUT.peopleService.deletePerson = jest
          .fn()
          .mockResolvedValue(true);
        let id;
        const result = await controllerUT.deletePersonById(
          id as unknown as number
        );
      } catch (error) {
        expect(error).toStrictEqual(validatePersonErrorResponse);
      }
    });
  });
});
