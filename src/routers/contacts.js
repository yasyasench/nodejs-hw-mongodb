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
import { updateContactsSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';


const router = Router();

router.get("/", ctrlWrapper(getServerStatusController));
router.get("/contacts", ctrlWrapper(getContactsController));
router.get("/contacts/:id", isValidId, ctrlWrapper(getContactByIdController));

router.post(
    "/contacts",
    validateBody(updateContactsSchema),
    ctrlWrapper(createContactController)
);

router.delete("/contacts/:id", isValidId, ctrlWrapper(deleteContactController));

router.patch(
    "/contacts/:id",
    isValidId,
    validateBody(updateContactsSchema),
    ctrlWrapper(patchContactController)
);

export default router;