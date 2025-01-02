import { z } from "zod";
import {MultipartFile } from "lambda-multipart-parser-v2"
import fileSchema from "../../constants/file.schema";

export const createProductDto = z.object({
  name: z.string({ message: 'name is required and must be a string' }),
  price: z.number({message: 'price is required and must be a number'}),
    image: z
    .object(fileSchema)
    .optional()
    .refine(
      (file): file is MultipartFile =>
        typeof file === "object" &&
        file !== null &&
        "filename" in file &&
        "contentType" in file &&
        "content" in file,
      {message:'image must be a file'}).transform(f=>f as MultipartFile),
});


