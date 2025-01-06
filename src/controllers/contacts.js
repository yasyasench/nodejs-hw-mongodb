import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';



export const getServerStatusController = (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
};

export const getContactsController = async (req, res) => {
	const { page, perPage } = parsePaginationParams(req.query);

	const { sortBy, sortOrder } = parseSortParams(req.query);

	const filter = parseFilterParams(req.query);

	const contacts = await getAllContacts({
		userId: req.user._id,
		page,
		perPage,
		sortBy,
		sortOrder,
		filter,
	});

	res.status(200).json({
		status: 200,
		message: "Successfully found contacts",
		data: contacts,
	});
};

export const getContactByIdController = async (req, res) => {
	const { id } = req.params;

	const contact = await getContactById(id, req.user._id);

	if (!contact) {
		throw createHttpError(404, "Contact not found");
	}

	res.status(200).json({
		status: 200,
		message: `Successfully found contact with id ${id}!`,
		data: contact,
	});
};

export const createContactController = async (req, res) => {
	const photo = req.file;
	let photoUrl;

	if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }


	const newContact = await createContact(
		{ ...req.body, photo: photoUrl },
		req.user,
	);

	res.status(201).json({
		status: 201,
		message: "Successfully created a contact!",
		data: newContact,
	});
};

export const patchContactController = async (req, res, next) => {
	const { id } = req.params;
	const photo = req.file;
	let photoUrl;

	if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

	const result = await updateContact(
		id,
		{ ...req.body, photo: photoUrl },
		req.user._id,
	);

	if (!result) {
		next(createHttpError(404, "Contact not found"));
	}

	res.json({
		status: 200,
		message: "Successfully patched a contact!",
		data: result.contact,
	});
};


export const deleteContactController = async (req, res, next) => {
	const { id } = req.params;

	const result = await deleteContact(id, req.user._id);

	if (!result) {
		next(createHttpError(404, "Contact not found"));
		return;
	}

	res.status(204).send();
};
