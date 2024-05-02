import { Router } from "express";
import { uploadFile } from "../controller/upload";
import { validateFields } from "../middleware/validate-fields";
import { body, query } from "express-validator";
import { handleFileUpload } from "../middleware/validate-file";

const router = Router();

router.post(
  "/",
  // Saves the file in req.file
  handleFileUpload,
  [
    query("id").optional().isString(),
    body("preset", "You must provide a cloudinary upload preset").notEmpty(),
    body("fileError")
      .optional()
      .custom((value: string) => {
        if (value !== "") throw new Error(value);
      }),
    validateFields,
  ],
  uploadFile
);

export default router;
