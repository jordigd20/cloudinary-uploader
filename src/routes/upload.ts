import { Router } from "express";
import { deleteFile, createFile, updateFile } from "../controller/upload";
import { validateFields } from "../middleware/validate-fields";
import { body, param } from "express-validator";
import { handleFileUpload } from "../middleware/validate-file";

const router = Router();

router.post(
  "/",
  // Saves the file in req.file
  handleFileUpload,
  [
    body("preset", "You must provide a cloudinary upload preset").notEmpty(),
    body("fileError")
      .optional()
      .custom((value: string) => {
        if (value !== "") throw new Error(value);
      }),
    validateFields,
  ],
  createFile
);

router.put(
  "/:id",
  handleFileUpload,
  [
    param("id").notEmpty(),
    body("preset", "You must provide a cloudinary upload preset").notEmpty(),
    body("fileError")
      .optional()
      .custom((value: string) => {
        if (value !== "") throw new Error(value);
      }),
    validateFields,
  ],
  updateFile
);

router.delete(
  "/:id",
  [
    param("id").notEmpty(),
    body("preset", "You must provide a cloudinary upload preset").notEmpty(),
    validateFields,
  ],
  deleteFile
);

export default router;
