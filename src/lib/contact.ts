/**
 * The contact form's messages go through Web3Forms (https://web3forms.com): the site has no server
 * of its own. Messages reach the inbox the access key was made for; that address never appears on
 * the site. The key itself is public by design (Web3Forms' docs say so) and is given to the build as
 * VITE_WEB3FORMS_KEY, from the repository variable WEB3FORMS_KEY.
 */
export const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';

export interface ContactFields {
  name: string;
  email: string;
  message: string;
  /** the hidden box only bots tick */
  botcheck?: boolean;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'network' }
  | { ok: false; reason: 'rejected'; detail: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(f: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (!f.name.trim()) errors.name = 'Tell us your name.';
  if (!EMAIL.test(f.email.trim())) errors.email = 'Enter an email address we can reply to, like name@example.com.';
  if (!f.message.trim()) errors.message = 'Write a message.';
  return errors;
}

export async function sendContact(
  f: ContactFields,
  { key, fetchFn = fetch }: { key: string; fetchFn?: typeof fetch },
): Promise<ContactResult> {
  if (f.botcheck) return { ok: true };
  if (!key) return { ok: false, reason: 'not-configured' };
  const name = f.name.trim();
  const email = f.email.trim();
  const body = {
    access_key: key,
    name,
    email,
    replyto: email,
    message: f.message.trim(),
    subject: `Message from ${name} via the TISE website`,
    from_name: 'TISE Sailing Club website',
    botcheck: false,
  };
  let response: Response;
  try {
    response = await fetchFn(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (response.ok) return { ok: true };
  const reply = (await response.json().catch(() => ({}))) as { message?: string };
  return { ok: false, reason: 'rejected', detail: reply.message ?? `HTTP ${response.status}` };
}
