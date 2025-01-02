import { z } from "zod";


export default {
      fieldname: z.string(),
      filename: z.string(),
      contentType: z.string(),
      content: z.any()
    }