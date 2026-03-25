git branch -M mainimport { z } from "zod";

export const userRoles = ["admin", "editor", "viewer"] as const;
export const userStatuses = ["active", "inactive", "pending"] as const;
export const userSortFields = [
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "email"
] as const;

const optionalTextField = (maxLength: number) =>
  z
    .union([z.string().trim().max(maxLength), z.literal("")])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      return value.trim() === "" ? null : value.trim();
    });

const userBodySchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  phone: optionalTextField(30),
  role: z.enum(userRoles),
  status: z.enum(userStatuses),
  notes: optionalTextField(300)
});

export const userIdSchema = z.object({
  id: z.string().trim().min(1)
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(8),
  search: z.string().trim().max(100).optional(),
  role: z.enum(userRoles).optional(),
  status: z.enum(userStatuses).optional(),
  sortBy: z.enum(userSortFields).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export const createUserSchema = userBodySchema;

export const updateUserSchema = userBodySchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "Debes enviar al menos un campo para actualizar"
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
