import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => await ContactsCollection.find();

export const getContactById = async (id) =>
	await ContactsCollection.findById(id);

export const createContact = async (contact) => {
	const newContact = await ContactsCollection.create(contact);
	return newContact;
};

export const deleteContact = async (id) => {
	const deleteContact = await ContactsCollection.findOneAndDelete({
		_id: id,
	});
	return deleteContact;
} 

export const updateContact = async (id, contact, options = {}) => {
	const updatedContact = await ContactsCollection.findOneAndUpdate(
		{
			_id: id,
		},
		contact,
		{
			new: true,
			includeResultMetadata: true,
			...options,
		},
	);

	if (!updatedContact || updatedContact.value === null) return null;

	return {
		contact: updatedContact.value,
		isNew: Boolean(updatedContact?.lastErrorObject?.upserted),
	};
};