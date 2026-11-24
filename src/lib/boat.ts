export type Facing = 1 | -1;

export interface BoatPose {
  /** 1: bow to the right, -1: bow to the left */
  facing: Facing;
  /** degrees, positive is clockwise */
  heel: number;
}

const MAX_HEEL = 9;
/** below this sideways share of the movement the boat keeps its heading (no flicker as it rounds a mark) */
const TACK_THRESHOLD = 0.08;

/** How the boat on the route sits, from the direction it is travelling (dx, dy) and the way it faced before. */
export function boatPose(dx: number, dy: number, previous: Facing): BoatPose {
  const length = Math.hypot(dx, dy);
  if (!length) return { facing: previous, heel: 0 };
  const sideways = dx / length;
  const facing: Facing = Math.abs(sideways) > TACK_THRESHOLD ? (sideways > 0 ? 1 : -1) : previous;
  const heel = Math.max(-MAX_HEEL, Math.min(MAX_HEEL, sideways * 24));
  return { facing, heel: Math.round(heel * 10) / 10 };
}

export interface Swell {
  /** vertical offset in px (negative is up) */
  lift: number;
  /** extra roll in degrees */
  roll: number;
}

// "+ 0" turns -0 into 0
const round = (n: number) => Math.round(n * 100) / 100 + 0;

/** The boat rising and rolling over the waves as it sails a given distance (px) along the route. */
export function swell(distance: number): Swell {
  return {
    lift: round(-3.6 * Math.sin(distance / 26)),
    roll: round(5.6 * Math.sin(distance / 41)),
  };
}

/** How far (px) the water under the hull has slid back as the boat sails, within one wave length. */
export function waterShift(distance: number, wavelength: number): number {
  return 0 - (((distance % wavelength) + wavelength) % wavelength);
}

/** How strong the wake behind the stern is (0–1) for the distance sailed since the last frame. */
export function wakeStrength(speed: number): number {
  return Math.min(1, Math.abs(speed) / 8);
}
