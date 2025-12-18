
import { PlotDataPoint, DerivativeStrings } from '../types';
import { X_RANGE, RESOLUTION } from '../constants.tsx';

// Assuming mathjs is available globally via CDN
declare const math: any;

/**
 * Safely computes derivatives using mathjs.
 * Returns safe defaults if the formula is syntactically incomplete.
 */
export function getDerivatives(formulaTemplate: string, params: Record<string, number>): DerivativeStrings {
  if (!formulaTemplate || formulaTemplate.trim() === '') {
    return { f: '0', f1: '0', f2: '0', f3: '0' };
  }

  // Replace parameters in the template
  let formula = formulaTemplate;
  Object.entries(params).forEach(([key, val]) => {
    const safeVal = val < 0 ? `(${val})` : val;
    // Use regex to replace only whole word parameters
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    formula = formula.replace(regex, safeVal.toString());
  });

  try {
    const fNode = math.parse(formula);
    const f1Node = math.derivative(fNode, 'x');
    const f2Node = math.derivative(f1Node, 'x');
    const f3Node = math.derivative(f2Node, 'x');

    return {
      f: fNode.toString(),
      f1: f1Node.toString(),
      f2: f2Node.toString(),
      f3: f3Node.toString(),
    };
  } catch (e) {
    // Silence common "unexpected end" errors during typing
    return { f: formula, f1: '0', f2: '0', f3: '0' };
  }
}

/**
 * Generates plot data points for the given derivative strings.
 * Handles invalid expressions gracefully by providing zero-values.
 */
export function generatePlotData(derivs: DerivativeStrings): PlotDataPoint[] {
  const data: PlotDataPoint[] = [];
  const start = X_RANGE[0];
  const end = X_RANGE[1];
  const step = (end - start) / RESOLUTION;

  let fComp, f1Comp, f2Comp, f3Comp;

  try {
    fComp = math.compile(derivs.f);
  } catch (e) { fComp = { evaluate: () => 0 }; }
  
  try {
    f1Comp = math.compile(derivs.f1);
  } catch (e) { f1Comp = { evaluate: () => 0 }; }

  try {
    f2Comp = math.compile(derivs.f2);
  } catch (e) { f2Comp = { evaluate: () => 0 }; }

  try {
    f3Comp = math.compile(derivs.f3);
  } catch (e) { f3Comp = { evaluate: () => 0 }; }

  for (let x = start; x <= end; x += step) {
    const scope = { x };
    try {
      data.push({
        x: Number(x.toFixed(2)),
        f: Number(fComp.evaluate(scope)) || 0,
        df1: Number(f1Comp.evaluate(scope)) || 0,
        df2: Number(f2Comp.evaluate(scope)) || 0,
        df3: Number(f3Comp.evaluate(scope)) || 0,
      });
    } catch (e) {
      data.push({ x: Number(x.toFixed(2)), f: 0, df1: 0, df2: 0, df3: 0 });
    }
  }

  return data;
}
