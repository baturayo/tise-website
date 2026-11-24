import { describe, expect, it } from 'vitest';
import { boatPose, swell, wakeStrength, waterShift } from './boat';

describe('boatPose', () => {
  it('faces right while the route heads down to the right', () => {
    expect(boatPose(5, 10, -1).facing).toBe(1);
  });

  it('faces left while the route heads down to the left', () => {
    expect(boatPose(-5, 10, 1).facing).toBe(-1);
  });

  it('keeps its heading where the route runs straight down, so it does not flicker at a mark', () => {
    expect(boatPose(0.2, 10, -1).facing).toBe(-1);
    expect(boatPose(0.2, 10, 1).facing).toBe(1);
  });

  it('dips the bow towards the direction of travel, never more than 9 degrees', () => {
    expect(boatPose(5, 10, 1).heel).toBeGreaterThan(0);
    expect(boatPose(-5, 10, -1).heel).toBeLessThan(0);
    expect(boatPose(100, 1, 1).heel).toBe(9);
    expect(boatPose(-100, 1, -1).heel).toBe(-9);
  });

  it('sits upright and keeps its heading when it is not moving', () => {
    expect(boatPose(0, 0, -1)).toEqual({ facing: -1, heel: 0 });
  });
});

describe('swell', () => {
  it('is level where the voyage starts', () => {
    expect(swell(0)).toEqual({ lift: 0, roll: 0 });
  });

  it('rocks the boat visibly over the waves as it sails, within 4px and 6 degrees', () => {
    const samples = Array.from({ length: 400 }, (_, i) => swell(i * 5));
    for (const s of samples) {
      expect(Math.abs(s.lift)).toBeLessThanOrEqual(4);
      expect(Math.abs(s.roll)).toBeLessThanOrEqual(6);
    }
    expect(Math.max(...samples.map((s) => s.roll))).toBeGreaterThan(4.5);
    expect(Math.min(...samples.map((s) => s.roll))).toBeLessThan(-4.5);
    expect(Math.max(...samples.map((s) => Math.abs(s.lift)))).toBeGreaterThan(3);
  });
});

describe('waterShift', () => {
  it('slides the water back past the hull as the boat sails, one wave length at a time', () => {
    expect(waterShift(0, 16)).toBe(0);
    expect(waterShift(4, 16)).toBe(-4);
    expect(waterShift(20, 16)).toBe(-4);
    expect(waterShift(-4, 16)).toBe(-12);
  });
});

describe('wakeStrength', () => {
  it('shows no wake when the boat is still', () => {
    expect(wakeStrength(0)).toBe(0);
  });
  it('grows with speed in either direction and is full from 8px a frame', () => {
    expect(wakeStrength(4)).toBeCloseTo(0.5);
    expect(wakeStrength(-4)).toBeCloseTo(0.5);
    expect(wakeStrength(30)).toBe(1);
  });
});
