import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => await ContactsCollection.find();

export const getContactById = async (id) =>
	await ContactsCollection.findById(id);