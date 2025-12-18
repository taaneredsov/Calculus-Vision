
import { Preset } from './types';

export const COLORS = {
  f: '#60a5fa',   // Blue-400
  f1: '#4ade80',  // Green-400
  f2: '#fbbf24',  // Amber-400
  f3: '#f87171',  // Red-400
};

export const PRESETS: Preset[] = [
  {
    id: 'poly',
    name: 'Polynomial',
    formula: 'a*x^3 + b*x^2 + c*x + d',
    defaultParams: { a: 0.2, b: 0, c: -2, d: 0 }
  },
  {
    id: 'trig',
    name: 'Trigonometric',
    formula: 'a * sin(b * x + c)',
    defaultParams: { a: 2, b: 1, c: 0 }
  },
  {
    id: 'exp',
    name: 'Exponential Wave',
    formula: 'a * exp(-0.1 * x^2) * cos(b * x + c)',
    defaultParams: { a: 4, b: 2, c: 0 }
  },
  {
    id: 'rational',
    name: 'Bell Curve',
    formula: 'a / (1 + b * (x - c)^2)',
    defaultParams: { a: 5, b: 0.5, c: 0 }
  }
];

export const X_RANGE = [-6, 6];
export const RESOLUTION = 100;
