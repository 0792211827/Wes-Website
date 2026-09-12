import { NextResponse } from "next/server";
import {
  contactSchema,
  toFieldErrors,
  type ContactResponse,
} from "@/lib/contact";

/**
 * Contact form submission.
 *
 * Validation is real and complete. Delivery is not wired up: no provider has
 * been chosen and no credentials exist, so rather than pretending to succeed,
 * a validated-but-undeliverable submission returns 503 and the form tells the
 * visitor to email directly.
 *
 * TODO(Phase 1): add a delivery provider, then send on success. Also add
 * per-IP rate limiting — this route is unauthenticated and world-reachable.
 */
export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please correct the highlighted fields.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  if (!process.env.CONTACT_TO_EMAIL) {
    // Deliberately loud: a form that silently swallows messages is worse than
    // one that admits it cannot send them.
    console.error(
      "[contact] CONTACT_TO_EMAIL is not set — submission validated but not delivered.",
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "The contact form is not connected yet. Please email me directly.",
      },
      { status: 503 },
    );
  }

  // TODO(Phase 1): deliver `parsed.data` via the chosen provider.
  return NextResponse.json(
    {
      ok: false,
      message:
        "The contact form is not connected yet. Please email me directly.",
    },
    { status: 503 },
  );
}
