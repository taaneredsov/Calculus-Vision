
import React, { useState, useMemo } from 'react';
import { PRESETS, COLORS } from './constants.tsx';
import { PlotDataPoint, Preset } from './types';
import { getDerivatives, generatePlotData } from './utils/mathUtils';
import { getCalculusInsight } from './services/gemini';
import Graph from './components/Graph';

type ViewMode = 'unified' | 'grid';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [activePreset, setActivePreset] = useState<Preset | null>(PRESETS[0]);
  const [formulaTemplate, setFormulaTemplate] = useState<string>(PRESETS[0].formula);
  const [params, setParams] = useState<Record<string, number>>(PRESETS[0].defaultParams);
  const [visibility, setVisibility] = useState({ f: true, f1: true, f2: true, f3: true });
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const derivs = useMemo(() => getDerivatives(formulaTemplate, params), [formulaTemplate, params]);
  const plotData = useMemo(() => generatePlotData(derivs), [derivs]);

  const handleParamChange = (key: string, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const handlePresetChange = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId)!;
    setActivePreset(preset);
    setFormulaTemplate(preset.formula);
    setParams(preset.defaultParams);
    setAiInsight(null);
  };

  const handleCustomTemplateChange = (val: string) => {
    setFormulaTemplate(val);
    setActivePreset(null);
  };

  const askAi = async () => {
    setIsAiLoading(true);
    const insight = await getCalculusInsight(derivs.f, derivs.f1, derivs.f2, derivs.f3);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  const toggleVis = (key: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Calculus Vision
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Visualize derivatives up to the third order. Use parameters to explore dynamic mathematical behavior.
            </p>
          </div>
          <button 
            onClick={askAi}
            disabled={isAiLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all rounded-full font-semibold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {isAiLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12L2.1 12c.1-4.8 3.3-8.8 7.9-9.7"/><path d="M12 12l2.1 6.9c-4.4 2-9.4.4-11.3-4.1"/></svg>
                Explain Math
              </>
            )}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Controls Sidebar */}
          <aside className="lg:col-span-4 space-y-4 md:space-y-6">
            
            {/* Input & Presets */}
            <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl space-y-5">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Input Function</h2>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <span className="font-serif italic font-bold">f(x) =</span>
                  </div>
                  <input
                    type="text"
                    value={formulaTemplate}
                    onChange={(e) => handleCustomTemplateChange(e.target.value)}
                    placeholder="e.g. a * sin(b * x)"
                    className="block w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-2">
                  <span className="h-[1px] flex-grow bg-slate-800"></span>
                  Presets
                  <span className="h-[1px] flex-grow bg-slate-800"></span>
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetChange(preset.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                        activePreset?.id === preset.id 
                        ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Parameters</h2>
              {(['a', 'b', 'c', 'd'] as const).map(key => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-medium text-slate-400">Parameter "{key}"</label>
                    <span className="font-mono text-blue-400 font-bold">{params[key] ?? 0}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={params[key] ?? 0}
                    onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Layers - Only relevant for Unified view really, but can serve as legend for Grid */}
            <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Legend & Visibility</h2>
              <div className="space-y-1.5">
                {(['f', 'f1', 'f2', 'f3'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => toggleVis(k)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      visibility[k] ? 'bg-slate-800/40 border-slate-700' : 'bg-transparent border-transparent opacity-30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[k] }}></div>
                      <span className="font-medium text-xs">
                        {k === 'f' ? 'f(x) Function' : 
                         k === 'f1' ? "f'(x) 1st Deriv" : 
                         k === 'f2' ? "f''(x) 2nd Deriv" : 
                         "f'''(x) 3rd Deriv"}
                      </span>
                    </div>
                    {viewMode === 'unified' && (
                      <div className={`w-7 h-3.5 rounded-full relative transition-colors ${visibility[k] ? 'bg-blue-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${visibility[k] ? 'left-4' : 'left-0.5'}`}></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Visualization Main Area */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* View Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
              <button 
                onClick={() => setViewMode('unified')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'unified' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="12" x2="12" y1="3" y2="21"/></svg>
                Unified View
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Grid View
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
              {viewMode === 'unified' ? (
                <div className="h-[500px]">
                  <Graph data={plotData} visibility={visibility} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[500px]">
                  <Graph data={plotData} singleKey="f" title="f(x) - Base Function" formula={derivs.f} height={220} />
                  <Graph data={plotData} singleKey="df1" title="f'(x) - First Derivative" formula={derivs.f1} height={220} />
                  <Graph data={plotData} singleKey="df2" title="f''(x) - Second Derivative" formula={derivs.f2} height={220} />
                  <Graph data={plotData} singleKey="df3" title="f'''(x) - Third Derivative" formula={derivs.f3} height={220} />
                </div>
              )}
            </div>
            
            {/* AI Insights Card */}
            {aiInsight && (
              <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex items-center gap-3 mb-5">
                   <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                   </div>
                   <h3 className="text-lg font-bold text-white tracking-tight">Mathematical Insight</h3>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {aiInsight}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-slate-600 text-xs border-t border-slate-900 pt-8 pb-8">
        <p>Calculus Vision • Symbolic Differentiation & Real-time Plotting</p>
      </footer>
    </div>
  );
};

export default App;
