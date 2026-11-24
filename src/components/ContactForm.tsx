import { useId, useRef, useState, type FormEvent } from 'react';
import { club } from '../data/club';
import { sendContact, validateContact, type ContactErrors, type ContactFields } from '../lib/contact';

/** Set at build time from the repository variable WEB3FORMS_KEY; without it the form stays hidden. */
const KEY: string = import.meta.env.VITE_WEB3FORMS_KEY ?? '';
export const contactFormReady = KEY !== '';

type Status = { state: 'idle' } | { state: 'sending' } | { state: 'sent' } | { state: 'failed'; text: string };

const FIELDS = ['name', 'email', 'message'] as const;

/** Write to the club: the message arrives by email, and the reply goes to the address given. */
export function ContactForm() {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fields: ContactFields = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      botcheck: data.get('botcheck') === 'on',
    };
    const found = validateContact(fields);
    setErrors(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus({ state: 'sending' });
    const result = await sendContact(fields, { key: KEY });
    if (result.ok) {
      setStatus({ state: 'sent' });
      return;
    }
    setStatus({
      state: 'failed',
      text:
        result.reason === 'network'
          ? "Your message didn't send because the connection dropped. Check you're online and send it again."
          : "Your message didn't send. Try again in a few minutes, or message us on Instagram.",
    });
  }

  if (status.state === 'sent') {
    return (
      <div className="contact contact--sent" role="status">
        <p className="contact__done">Message sent</p>
        <p>Thanks for writing. We'll reply by email.</p>
      </div>
    );
  }

  const field = (name: (typeof FIELDS)[number]) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  });
  const error = (name: (typeof FIELDS)[number]) =>
    errors[name] && (
      <p className="contact__error" id={`${id}-${name}-error`}>
        {errors[name]}
      </p>
    );

  return (
    <form className="contact" ref={form} onSubmit={onSubmit} noValidate aria-label="Write to the club">
      <div className="contact__field">
        <label htmlFor={`${id}-name`}>Name</label>
        <input type="text" autoComplete="name" {...field('name')} />
        {error('name')}
      </div>
      <div className="contact__field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input type="email" autoComplete="email" inputMode="email" {...field('email')} />
        {error('email')}
      </div>
      <div className="contact__field">
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea
          rows={5}
          placeholder="Which activity caught your eye? Have you sailed before?"
          {...field('message')}
        />
        {error('message')}
      </div>
      {/* only bots fill this in */}
      <input className="contact__trap" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn--primary contact__send" type="submit" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p className="contact__status" role="status">
        {status.state === 'failed' ? status.text : ''}
      </p>
      <p className="contact__note">
        We use your details only to reply. Messages are delivered by Web3Forms. Prefer Instagram?{' '}
        <a href={club.instagram} target="_blank" rel="noopener noreferrer">
          Message us there
        </a>
        .
      </p>
    </form>
  );
}
