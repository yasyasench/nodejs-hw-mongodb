import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
	userId,
	page = 1,
	perPage = 10,
	sortBy = "_id",
	sortOrder = SORT_ORDER.ASC,
	filter = {},
}) => {
	const limit = perPage;
	const skip = (page - 1) * perPage;

	const contactsQuery = ContactsCollection.find({ userId });

	if (filter.isFavourite) {
		contactsQuery.where("isFavourite").equals(filter.isFavourite);
	}
	if (filter.type) {
		contactsQuery.where("contactType").equals(filter.type);
	}


	const [contactsCount, contacts] = await Promise.all([
		ContactsCollection.find({userId,}).merge(contactsQuery).countDocuments(),
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

export const getContactById = async (id, userId,) =>
	await ContactsCollection.findOne({ _id: id, userId });

export const createContact = async (contact, user) => {
	const newContact = await ContactsCollection.create({
		...contact,
		userId: user._id,
	});
	return newContact;
};

export const deleteContact = async (id, userId) => {
	const deletedContact = await ContactsCollection.findOneAndDelete({
		_id: id,
		userId,
	});

	return deletedContact;
};

export const updateContact = async (id, contact, userId, options = {}) => {
	const updatedContact = await ContactsCollection.findOneAndUpdate(
		{
			_id: id,
			userId,
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