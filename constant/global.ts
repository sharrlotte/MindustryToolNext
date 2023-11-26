import { z } from "zod";

const configSchema = z.object({
  webVersion: z.string(),
  themes: z.array(z.string()),
  locales: z.array(z.string()),
  defaultLocale: z.string(),
  apiUrl: z.string(),
  baseUrl: z.string(),
});


const conf = configSchema.parse({
  webVersion: "Beta 0.9.0",
  themes: ["light", "dark", "system"],
  locales: ["vi", "en-US"],
  defaultLocale: "en-US",
  apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  baseUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
});

export default conf;
