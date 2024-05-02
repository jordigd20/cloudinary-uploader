import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const createFile = async (req: Request, res: Response) => {
  const { preset } = req.body;
  const { file } = req;

  if (!file) {
    return res
      .status(400)
      .json({ errors: [{ msg: "You must provide a file to upload" }] });
  }

  try {
    const uploadResult = await uploadFile({
      file,
      preset,
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

export const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { preset } = req.body;
  const { file } = req;

  if (!file) {
    return res
      .status(400)
      .json({ errors: [{ msg: "You must provide a file to upload" }] });
  }

  // Check if the file exists in Cloudinary
  try {
    await cloudinary.api.resource(`${preset}/${id}` as string);
  } catch (err: any) {
    console.log(err);
    const { error } = err;

    if (error) {
      return res.status(error.http_code).json({
        errors: [{ msg: error.message }],
      });
    } else {
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal server error" }] });
    }
  }

  try {
    const uploadResult = await uploadFile({
      file,
      preset,
      id,
    });

    return res.json({
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      message: "File updated successfully",
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

const uploadFile = ({
  file,
  preset,
  id,
}: {
  file: Express.Multer.File;
  preset: string;
  id?: string;
}): Promise<any> => {
  const options = !id ? {} : { public_id: id as string, overwrite: true };

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          ...options,
          resource_type: "image",
          upload_preset: preset,
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
};
