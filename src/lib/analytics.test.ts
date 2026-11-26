import { describe, expect, it, vi } from 'vitest';
import { countEvent, goatCounterTag, withAnalytics } from './analytics';

describe('goatCounterTag', () => {
  it('loads GoatCounter’s counter for our site', () => {
    const tag = goatCounterTag('tisesailing');
    expect(tag).toContain('data-goatcounter="https://tisesailing.goatcounter.com/count"');
    expect(tag).toContain('src="https://gc.zgo.at/count.js"');
    expect(tag).toContain(' async ');
  });
});

describe('withAnalytics', () => {
  it('puts the counter at the end of the page’s head, once', () => {
    const html = withAnalytics('<html><head><title>T</title></head><body></body></html>', 'tisesailing');
    expect(html.match(/gc\.zgo\.at\/count\.js/g)).toHaveLength(1);
    expect(html.indexOf('count.js')).toBeLessThan(html.indexOf('</head>'));
    expect(html.indexOf('<title>')).toBeLessThan(html.indexOf('count.js'));
  });

  it('refuses a page without a head', () => {
    expect(() => withAnalytics('<body></body>', 'tisesailing')).toThrow();
  });
});

describe('countEvent', () => {
  it('counts an event, not a page view', () => {
    const count = vi.fn();
    countEvent('read-to-the-end/gibraltar-to-las-palmas', 'Read to the end: Gibraltar to Las Palmas', { goatcounter: { count } });
    expect(count).toHaveBeenCalledWith({
      path: 'read-to-the-end/gibraltar-to-las-palmas',
      title: 'Read to the end: Gibraltar to Las Palmas',
      event: true,
    });
  });

  it('does nothing where the counter isn’t loaded (in development, or blocked)', () => {
    expect(() => countEvent('x', 'y', {})).not.toThrow();
  });
});
