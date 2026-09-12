"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  contactSchema,
  toFieldErrors,
  type ContactFieldErrors,
  type ContactResponse,
} from "@/lib/contact";

type Status = "idle" | "submitting" | "error";

const INPUT_CLASS =
  "mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground";

/** Labelled field with its error message wired up via `aria-describedby`. */
function Field({
  id,
  name,
  label,
  error,
  children,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  /** Renders the control, given the props it must carry for accessibility. */
  children: (props: {
    id: string;
    name: string;
    required: true;
    className: string;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children({
        id,
        name,
        required: true,
        className: INPUT_CLASS,
        ...(error ? { "aria-invalid": true, "aria-describedby": errorId } : {}),
      })}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Contact form.
 *
 * Validates on the client against the same schema `/api/contact` uses, so
 * errors are immediate — then the server re-validates, because client
 * validation is only a convenience. Errors are tied to their inputs and
 * announced through a live region (CLAUDE.md §4).
 */
export function ContactForm() {
  const prefix = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      setFormError("Please correct the highlighted fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        // TODO(Phase 1): success state, once delivery is wired up.
        setStatus("idle");
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.message);
      setStatus("error");
    } catch {
      setFormError(
        "Could not reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-6">
      <Field
        id={`${prefix}-name`}
        name="name"
        label="Name"
        error={fieldErrors.name}
      >
        {(props) => <input {...props} type="text" autoComplete="name" />}
      </Field>

      <Field
        id={`${prefix}-email`}
        name="email"
        label="Email"
        error={fieldErrors.email}
      >
        {(props) => <input {...props} type="email" autoComplete="email" />}
      </Field>

      <Field
        id={`${prefix}-message`}
        name="message"
        label="What are you working on?"
        error={fieldErrors.message}
      >
        {(props) => <textarea {...props} rows={6} />}
      </Field>

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-muted">
        {formError}
      </p>
    </form>
  );
}
