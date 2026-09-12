import { z } from "zod";

/**
 * Contact form contract, shared by the client form and `/api/contact` so the
 * two can never disagree about what is valid.
 *
 * NOTE: these fields are an assumption — `docs/requirements.md` was empty when
 * this was built. Adjust the schema when the spec lands; the form and the route
 * both follow it automatically.
 */
// Each field carries its own `error` message so a missing or wrong-typed value
// reports the same human sentence as an invalid one, instead of zod's internal
// "expected string, received undefined" reaching the visitor.
export const contactSchema = z.object({
  name: z
    .string({ error: "Tell me your name." })
    .trim()
    .min(1, "Tell me your name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .email({ error: "That does not look like an email address." })
    .max(200, "That email address is too long."),
  message: z
    .string({ error: "Tell me what you are working on." })
    .trim()
    .min(20, "A little more detail helps — at least 20 characters.")
    .max(5000, "Please keep it under 5000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

/** Flattens zod issues into one message per field, for `aria-describedby`. */
export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof ContactInput] = issue.message;
    }
  }
  return errors;
}
