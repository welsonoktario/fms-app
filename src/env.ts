import { z } from "zod";

const envSchema = z.object({
  BASE_URL: z.string().url(),
  API_URL: z.string().url().startsWith('EXPO_PUBLIC_'),
});
