import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
	page = 1,
	perPage = 10,
	sortBy = "_id",
	sortOrder = SORT_ORDER.ASC,
	filter = {},
}) => {
	const limit = perPage;
	const skip = (page - 1) * perPage;

	const contactsQuery = ContactsCollection.find();

	if (filter.isFavourite) {
		contactsQuery.where("isFavourite").equals(filter.isFavourite);
	}
	if (filter.type) {
		contactsQuery.where("contactType").equals(filter.type);
	}


	const [contactsCount, contacts] = await Promise.all([
		ContactsCollection.find().merge(contactsQuery).countDocuments(),
		contactsQuery
			.skip(skip)
			.limit(limit)
			.sort({ [sortBy]: sortOrder })
			.exec(),
	]);
	
	const paginationData = calculatePaginationData(contactsCount, perPage, page);
 
	return {
		data: contacts,
		...paginationData,
	};
};

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