import { z } from 'zod';

export const fileSchema = z.object({
  id: z.string().uuid(), // UUID v4 or v5
  name: z.string().min(1, "Filename cannot be empty"),
  folder_id: z.string().uuid().optional().nullable(), // Assuming folder_id is a UUID too
  user_id: z.string().uuid(), // Assuming user_id is also a UUID
  public_id: z.string().min(1, "Public ID cannot be empty"),
  type: z
    .string(),
  is_private: z.boolean(),
  size: z
    .number()
    .int()
    .min(1, { message: "File size must be > 0" })
    .max(500 * 1024 * 1024, { message: "File must be <= 500MB" }),

  // Optional field: only if it's present
  updated_at: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "updated_at must be a valid date string",
    }),
      created_at: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "updated_at must be a valid date string",
    }),
});
export const fileArray = z.array(fileSchema);

export const fileArrayValidator = (data: unknown) => {
  const result = fileArray.safeParse(data);
  return {
    error: result.success ? null : result.error,
    value: result.success ? result.data : null,
  };
};

// optional type extraction
export type File = z.infer<typeof fileSchema>;
