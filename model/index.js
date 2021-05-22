const fs = require("fs/promises");
// const contacts = require('./contacts.json')
const path = require("path");
const { v4: uuid } = require("uuid");

const readData = async () => {
  const data = await fs.readFile(path.join(__dirname, "contacts.json"), "utf8");
  return JSON.parse(data);
};

const listContacts = async () => {
  return await readData();
};

const getContactById = async (id) => {
  const data = await readData();
  const [result] = data.filter((contact) => contact.id === id);
  return result;
};

const removeContact = async (id) => {
  const data = await readData();
  const index = data.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    const result = data.splice(index, 1);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data)
    );
    return result;
  }
  return null;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  const data = await readData();
  data.push(record);
  await fs.writeFile(
    path.join(__dirname, "contacts.json"),
    JSON.stringify(data)
  );
  return record;
};

const updateContact = async (id, body) => {
  const data = await readData();
  const [result] = data.filter((contact) => contact.id === id);
  if (result) {
    Object.assign(result, body);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data)
    );
  }
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
