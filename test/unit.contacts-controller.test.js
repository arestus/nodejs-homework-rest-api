const { expectCt } = require("helmet");
const { updateContact } = require("../controllers/contacts");
const Contacts = require("../repositories/contacts");

jest.mock("../repositories/contacts");

describe("Unit test controller contacts", () => {
  const req = { user: { id: 1 }, body: {}, params: { id: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();
  it("update contact exist", async () => {
    const contact = { id: 3, name: "Jhon", email: "sinsin@mail.com" };
    Contacts.updateContact = jest.fn(() => {
      return contact;
    });

    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result.status).toEqual("success");
    expect(result.code).toEqual(200);
    expect(result.data.contact).toEqual(contact);
  });
  it("update contact not exist", async () => {
    Contacts.updateContact = jest.fn();
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result.status).toEqual("error");
    expect(result.code).toEqual(404);
    expect(result.message).toEqual("Not found");
  });
  it("update contact: repositories return Error", async () => {
    Contacts.updateContact = jest.fn(() => {
      throw new Error("Oops");
    });
    await updateContact(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
