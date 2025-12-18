
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';
import { PlotDataPoint } from '../types';
import { COLORS } from '../constants.tsx';

interface GraphProps {
  data: PlotDataPoint[];
  visibility?: {
    f: boolean;
    f1: boolean;
    f2: boolean;
    f3: boolean;
  };
  singleKey?: keyof Omit<PlotDataPoint, 'x'>;
  title?: string;
  height?: number | string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded-lg shadow-xl text-[10px] md:text-xs">
        <p className="font-bold text-slate-400 mb-0.5">x = {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(3)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Graph: React.FC<GraphProps> = ({ data, visibility, singleKey, title, height = "100%" }) => {
  const isUnified = !!visibility;

  const renderLine = (dataKey: string, name: string, color: string, dashed = false, strokeWidth = 2) => (
    <Line 
      type="monotone" 
      dataKey={dataKey} 
      name={name} 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeDasharray={dashed ? "5 5" : undefined}
      dot={false} 
      animationDuration={300}
    />
  );

  return (
    <div className="w-full h-full bg-slate-900/40 rounded-xl p-2 md:p-4 border border-slate-800/60 shadow-inner flex flex-col">
      {title && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2 px-2">{title}</h3>}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="x" 
              stroke="#475569" 
              tick={{ fontSize: 10 }} 
              axisLine={{ stroke: '#334155' }}
              hide={!isUnified && !!title} // Simplify axes for grid items
            />
            <YAxis 
              stroke="#475569" 
              tick={{ fontSize: 10 }} 
              domain={['auto', 'auto']}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {isUnified && <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />}
            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
            <ReferenceLine x={0} stroke="#334155" strokeWidth={1} />
            
            {isUnified ? (
              <>
                {visibility!.f && renderLine("f", "f(x)", COLORS.f, false, 3)}
                {visibility!.f1 && renderLine("df1", "f'(x)", COLORS.f1, true)}
                {visibility!.f2 && renderLine("df2", "f''(x)", COLORS.f2)}
                {visibility!.f3 && renderLine("df3", "f'''(x)", COLORS.f3, true, 1.5)}
              </>
            ) : (
              singleKey && renderLine(
                singleKey, 
                singleKey === 'f' ? 'f(x)' : singleKey === 'df1' ? "f'(x)" : singleKey === 'df2' ? "f''(x)" : "f'''(x)",
                singleKey === 'f' ? COLORS.f : singleKey === 'df1' ? COLORS.f1 : singleKey === 'df2' ? COLORS.f2 : COLORS.f3,
                singleKey === 'df1' || singleKey === 'df3'
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
