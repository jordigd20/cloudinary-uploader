import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const createFile = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { preset } = req.body;
  const { file } = req;

  if (!req.file) {
    return res
      .status(400)
      .json({ errors: [{ msg: "You must provide a file to upload" }] });
  }

  try {
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            overwrite: true,
            upload_preset: preset,
            public_id: id as string,
          },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }

            return resolve(uploadResult);
          }
        )
        .end(file.buffer);
    });

    return res.json({
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: "Internal server error" }] });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { preset } = req.body;

  try {
    const deleteResult = await cloudinary.uploader.destroy(`${preset}/${id}`);

    if (deleteResult.result === "not found") {
      return res.status(404).json({ errors: [{ msg: "File not found" }] });
    }

    return res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: [{ msg: "Internal server error" }] });
  }
};
