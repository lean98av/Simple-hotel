import { Router } from "express";

import { settingsHome, settingsHomeSavePost} from "../controllers/adminSettingController";
import { adminAuthMiddleware, adminAuthPostMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", adminAuthMiddleware, settingsHome);

router.post("/", adminAuthPostMiddleware,settingsHomeSavePost);

export default router;