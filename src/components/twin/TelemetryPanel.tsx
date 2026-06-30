import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { Activity, Heart, Droplet, Thermometer, Zap, Eye, Wind } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const { vitals, history, alarms } = useHealthTwin();

  // Helper to render inline lightweight SVG sparkline
  const renderSparkline = (data: number[], strokeColor: string) => {
    if (!data || data.length < 2) return null;
    const width = 160;
    const height = 30;
    const min = Math.min(...data) * 0.98;
    const max = Math.max(...data) * 1.02;
    const range = (max - min) || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mt-1">
        {/* Sparkline path */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          points={points}
        />
        {/* Shaded gradient fill */}
        <path
          d={`M 0,${height} L ${points} L ${width},${height} Z`}
          fill={`url(#grad-${strokeColor.replace('#', '')})`}
          opacity="0.12"
        />
        <defs>
          <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const getAlertClass = (val: number, min: number, max: number) => {
    if (val < min || val > max) return 'border-rose-500/30 bg-rose-500/5 vital-alert-state';
    return 'border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/20';
  };

  const vitalsList = [
    { 
      label: 'Heart Rate', 
      val: vitals.hr, 
      unit: 'BPM', 
      icon: Heart, 
      color: '#f43f5e', 
      data: history.hr,
      min: alarms.hr.min,
      max: alarms.hr.max
    },
    { 
      label: 'Blood Pressure', 
      val: `${vitals.bpSys}/${vitals.bpDia}`, 
      unit: 'mmHg', 
      icon: Activity, 
      color: '#f59e0b', 
      data: history.bpSys, // plot sys BP trend
      min: alarms.bpSys.min,
      max: alarms.bpSys.max
    },
    { 
      label: 'Blood Glucose', 
      val: vitals.cgm, 
      unit: 'mg/dL', 
      icon: Droplet, 
      color: '#06b6d4', 
      data: history.cgm,
      min: alarms.cgm.min,
      max: alarms.cgm.max
    },
    { 
      label: 'Oxygen Saturation', 
      val: vitals.spo2, 
      unit: '%', 
      icon: Wind, 
      color: '#10b981', 
      data: history.spo2,
      min: alarms.spo2.min,
      max: alarms.spo2.max
    },
    { 
      label: 'Body Temperature', 
      val: vitals.temp.toFixed(1), 
      unit: '°F', 
      icon: Thermometer, 
      color: '#eab308', 
      data: history.temp,
      min: alarms.temp.min,
      max: alarms.temp.max
    },
    { 
      label: 'Skin GSR', 
      val: vitals.gsr.toFixed(1), 
      unit: 'µS', 
      icon: Zap, 
      color: '#a100ff', 
      data: history.gsr,
      min: 0,
      max: 4.5
    },
  ];

  return (
    <div className="flex flex-col gap-4 overflow-y-auto pr-1 h-full select-none">
      <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-1">
        Vitals Telemetry Stream
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {vitalsList.map((item, idx) => {
          const Icon = item.icon;
          const isBreached = typeof item.val === 'number' 
            ? (item.val < item.min || item.val > item.max)
            : (vitals.bpSys < alarms.bpSys.min || vitals.bpSys > alarms.bpSys.max);

          return (
            <div
              key={idx}
              className={`p-4 border backdrop-blur-xl rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col gap-2 ${getAlertClass(
                typeof item.val === 'number' ? item.val : vitals.bpSys, 
                item.min, 
                item.max
              )}`}
            >
              {/* Highlight accent left border block */}
              <div 
                className="absolute top-0 left-0 w-[3px] h-full"
                style={{ backgroundColor: item.color }}
              ></div>

              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                  {item.label}
                </span>
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: item.color }} 
                />
              </div>

              <div className="flex justify-between items-baseline mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono tracking-tight text-slate-100">
                    {item.val}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.unit}
                  </span>
                </div>

                {isBreached && (
                  <span className="text-[9px] font-mono font-bold text-rose-500 uppercase px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 animate-pulse">
                    Alert
                  </span>
                )}
              </div>

              {/* Sparkline trend representation */}
              <div className="opacity-90">
                {renderSparkline(item.data, item.color)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TelemetryPanel;
