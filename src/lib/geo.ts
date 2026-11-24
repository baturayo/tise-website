export interface Coords {
  lat: number;
  lon: number;
}

function dm(value: number, pos: string, neg: string): string {
  const total = Math.round(Math.abs(value) * 60);
  const deg = Math.floor(total / 60);
  const min = total % 60;
  return `${deg}°${String(min).padStart(2, '0')}′${value < 0 ? neg : pos}`;
}

/** A position written the way it is on a chart: 51°40′N 4°06′E. */
export function formatCoords({ lat, lon }: Coords): string {
  return `${dm(lat, 'N', 'S')} ${dm(lon, 'E', 'W')}`;
}
