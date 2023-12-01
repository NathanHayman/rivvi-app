import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const pageSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  type: z.string(),
});

export type Page = z.infer<typeof pageSchema>;
