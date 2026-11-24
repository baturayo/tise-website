/** Five-point star path centred on (cx, cy) with outer radius r. */
export function starPath(cx: number, cy: number, r: number): string {
  const inner = r * 0.4;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** The European ring: n points evenly spaced on a circle, starting at 12 o'clock. */
export function ring(cx: number, cy: number, radius: number, n = 12): Array<[number, number]> {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  });
}
