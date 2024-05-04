import { NextFunction, Request, Response } from "express";
import multer from "multer";

const upload = multer({
  fileFilter: (req, file, cb) => {
    const { mimetype } = file;
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/svg",
      "image/webp",
      "image/avif",
      "image/svg+xml"
    ];

    if (!allowedMimeTypes.includes(mimetype)) {
      req.body.fileError =
        "File extension not supported. Please provide a valid image file.";
      return cb(null, false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).single("file");

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).json({
            errors: [{ msg: "You can't provide more than one file" }],
          });
        case "LIMIT_FILE_SIZE":
          return res.status(400).json({
            errors: [
              {
                msg: `File size too large. File must be less than 2MB`,
              },
            ],
          });
        default:
          return res.status(400).json({ errors: [{ msg: err.message }] });
      }
    } else if (err) {
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal server error" }] });
    }

    next();
  });
};
