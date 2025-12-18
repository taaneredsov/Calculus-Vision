
import { PlotDataPoint, DerivativeStrings } from '../types';
import { X_RANGE, RESOLUTION } from '../constants.tsx';

// Assuming mathjs is available globally via CDN
declare const math: any;

export function getDerivatives(formulaTemplate: string, params: Record<string, number>): DerivativeStrings {
  // Replace parameters in the template
  let formula = formulaTemplate;
  Object.entries(params).forEach(([key, val]) => {
    // Wrap negative numbers in parentheses to avoid syntax errors
    const safeVal = val < 0 ? `(${val})` : val;
    formula = formula.split(key).join(safeVal.toString());
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
    console.error("Derivation error", e);
    return { f: formula, f1: '0', f2: '0', f3: '0' };
  }
}

export function generatePlotData(derivs: DerivativeStrings): PlotDataPoint[] {
  const data: PlotDataPoint[] = [];
  const start = X_RANGE[0];
  const end = X_RANGE[1];
  const step = (end - start) / RESOLUTION;

  try {
    const fComp = math.compile(derivs.f);
    const f1Comp = math.compile(derivs.f1);
    const f2Comp = math.compile(derivs.f2);
    const f3Comp = math.compile(derivs.f3);

    for (let x = start; x <= end; x += step) {
      const scope = { x };
      data.push({
        x: Number(x.toFixed(2)),
        f: fComp.evaluate(scope),
        df1: f1Comp.evaluate(scope),
        df2: f2Comp.evaluate(scope),
        df3: f3Comp.evaluate(scope),
      });
    }
  } catch (e) {
    console.error("Evaluation error", e);
  }

  return data;
}
