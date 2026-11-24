import { describe, expect, it, vi } from 'vitest';
import { CONTACT_ENDPOINT, sendContact, validateContact } from './contact';

const filled = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Can I join the Zeeland weekend?' };
const reply = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));

describe('validateContact', () => {
  it('accepts a name, an email address and a message', () => {
    expect(validateContact(filled)).toEqual({});
  });

  it('says what is missing or wrong, field by field', () => {
    expect(validateContact({ name: ' ', email: 'ada@', message: '' })).toEqual({
      name: 'Tell us your name.',
      email: 'Enter an email address we can reply to, like name@example.com.',
      message: 'Write a message.',
    });
  });
});

describe('sendContact', () => {
  it('posts the message to Web3Forms with the access key, a subject naming the sender and the reply address', async () => {
    const fetchFn = vi.fn(() => reply(200, { success: true, message: 'Email sent successfully!' }));
    await expect(sendContact(filled, { key: 'k-123', fetchFn })).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(CONTACT_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json', Accept: 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual({
      access_key: 'k-123',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      replyto: 'ada@example.com',
      message: 'Can I join the Zeeland weekend?',
      subject: 'Message from Ada Lovelace via the TISE website',
      from_name: 'TISE Sailing Club website',
      botcheck: false,
    });
  });

  it('reports what the service said when it refuses the message', async () => {
    const fetchFn = vi.fn(() => reply(400, { success: false, message: 'Invalid access key' }));
    await expect(sendContact(filled, { key: 'bad', fetchFn })).resolves.toEqual({
      ok: false,
      reason: 'rejected',
      detail: 'Invalid access key',
    });
  });

  it('reports a network failure', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(sendContact(filled, { key: 'k', fetchFn })).resolves.toEqual({ ok: false, reason: 'network' });
  });

  it('sends nothing when the form has no key yet', async () => {
    const fetchFn = vi.fn();
    await expect(sendContact(filled, { key: '', fetchFn })).resolves.toEqual({ ok: false, reason: 'not-configured' });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('quietly drops a message from a bot that ticked the hidden box', async () => {
    const fetchFn = vi.fn();
    await expect(sendContact({ ...filled, botcheck: true }, { key: 'k', fetchFn })).resolves.toEqual({ ok: true });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
