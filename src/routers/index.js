import { Router } from "express";
import authRouter from "./auth.js";
import contactsRouter from "./contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getServerStatusController } from "../controllers/contacts.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/contacts", contactsRouter);
router.get("/", ctrlWrapper(getServerStatusController));

export default router;