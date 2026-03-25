import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatorio"),
  CLIENT_URL: z.string().url().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Variables de entorno invalidas:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error("No se pudo iniciar la API por variables de entorno invalidas");
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === "production";
