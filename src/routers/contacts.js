import { Router } from 'express';
import {
    createContactController,
    deleteContactController,
    getContactByIdController,
    getContactsController,
    getServerStatusController,
    patchContactController
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactsSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';


const router = Router();

router.get("/", ctrlWrapper(getServerStatusController));
router.get("/contacts", ctrlWrapper(getContactsController));
router.get("/contacts/:id", isValidId, ctrlWrapper(getContactByIdController));

router.post(
    "/contacts",
    validateBody(createContactsSchema),
    ctrlWrapper(createContactController)
);

router.delete("/contacts/:id", isValidId, ctrlWrapper(deleteContactController));

router.patch(
    "/contacts/:id",
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController)
);

export default router;