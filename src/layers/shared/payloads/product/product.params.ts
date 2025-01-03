import { z } from "zod";

export default z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
});
