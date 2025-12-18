
export interface Parameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface Preset {
  id: string;
  name: string;
  formula: string; // The formula template, e.g., "a * x^3 + b * x^2 + c * x + d"
  defaultParams: Record<string, number>;
}

export interface PlotDataPoint {
  x: number;
  f: number;
  df1: number;
  df2: number;
  df3: number;
}

export interface DerivativeStrings {
  f: string;
  f1: string;
  f2: string;
  f3: string;
}
