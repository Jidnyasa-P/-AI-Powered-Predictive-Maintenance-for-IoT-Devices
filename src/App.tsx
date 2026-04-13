/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Gauge, 
  Settings, 
  ShieldAlert, 
  Zap,
  Thermometer,
  Waves,
  History,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface SensorData {
  time: string;
  temperature: number;
  vibration: number;
  current: number;
}

interface PredictionResult {
  status: 'Normal' | 'Warning' | 'Critical';
  probability: number;
  message: string;
}

// --- Constants ---
const MAX_DATA_POINTS = 20;
const NORMAL_RANGES = {
  temp: { min: 30, max: 50 },
  vib: { min: 1, max: 3 },
  curr: { min: 8, max: 15 }
};

export default function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isFailureMode, setIsFailureMode] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult>({
    status: 'Normal',
    probability: 0.02,
    message: 'System operating within optimal parameters.'
  });

  // --- Simulation Logic ---
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setData(prev => {
        const lastPoint = prev[prev.length - 1];
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        // Generate new values based on mode
        let nextTemp, nextVib, nextCurr;

        if (isFailureMode) {
          // Drifting towards failure
          nextTemp = (lastPoint?.temperature || 40) + Math.random() * 5;
          nextVib = (lastPoint?.vibration || 2) + Math.random() * 1.5;
          nextCurr = (lastPoint?.current || 10) + Math.random() * 4;
        } else {
          // Normal fluctuation
          nextTemp = 40 + (Math.random() - 0.5) * 4;
          nextVib = 2 + (Math.random() - 0.5) * 0.5;
          nextCurr = 10 + (Math.random() - 0.5) * 2;
        }

        const newDataPoint = {
          time: timeStr,
          temperature: parseFloat(nextTemp.toFixed(2)),
          vibration: parseFloat(nextVib.toFixed(2)),
          current: parseFloat(nextCurr.toFixed(2))
        };

        const updated = [...prev, newDataPoint];
        return updated.slice(-MAX_DATA_POINTS);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, isFailureMode]);

  // --- Mock AI Prediction Logic ---
  useEffect(() => {
    if (data.length === 0) return;
    const latest = data[data.length - 1];

    let score = 0;
    if (latest.temperature > 70) score += 0.6;
    else if (latest.temperature > 55) score += 0.3;

    if (latest.vibration > 6) score += 0.5;
    else if (latest.vibration > 4) score += 0.2;

    if (latest.current > 20) score += 0.4;
    else if (latest.current > 15) score += 0.1;

    if (score >= 0.8) {
      setPrediction({
        status: 'Critical',
        probability: Math.min(0.99, 0.85 + Math.random() * 0.1),
        message: 'CRITICAL: Immediate maintenance required. High risk of motor seizure.'
      });
    } else if (score >= 0.3) {
      setPrediction({
        status: 'Warning',
        probability: 0.4 + Math.random() * 0.2,
        message: 'WARNING: Abnormal patterns detected. Schedule inspection within 24h.'
      });
    } else {
      setPrediction({
        status: 'Normal',
        probability: 0.01 + Math.random() * 0.05,
        message: 'System operating within optimal parameters.'
      });
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Predictive Maintenance AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Industrial IoT v2.4</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isSimulating ? "bg-green-500" : "bg-red-500")} />
              <span className="text-xs font-medium text-slate-400">{isSimulating ? 'Live Stream' : 'Paused'}</span>
            </div>
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Top Stats & AI Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Prediction Card */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-900 to-black border border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-blue-500" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    AI Inference Engine
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    Random Forest Classifier
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Machine Health Status
                  </h2>
                  <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                    Real-time analysis of multi-sensor telemetry to predict potential mechanical failures before they impact production.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl",
                    prediction.status === 'Normal' && "bg-green-500/20 text-green-500 shadow-green-500/10",
                    prediction.status === 'Warning' && "bg-amber-500/20 text-amber-500 shadow-amber-500/10",
                    prediction.status === 'Critical' && "bg-red-500/20 text-red-500 shadow-red-500/10 animate-pulse"
                  )}>
                    {prediction.status === 'Normal' && <CheckCircle2 className="w-8 h-8" />}
                    {prediction.status === 'Warning' && <AlertTriangle className="w-8 h-8" />}
                    {prediction.status === 'Critical' && <ShieldAlert className="w-8 h-8" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current State</p>
                    <p className={cn(
                      "text-2xl font-black tracking-tight",
                      prediction.status === 'Normal' && "text-green-500",
                      prediction.status === 'Warning' && "text-amber-500",
                      prediction.status === 'Critical' && "text-red-500"
                    )}>
                      {prediction.status}
                    </p>
                  </div>
                </div>

                <div className="h-12 w-px bg-white/10 hidden sm:block" />

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Failure Probability</p>
                  <p className="text-2xl font-black text-white tracking-tight">
                    {(prediction.probability * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        "{prediction.message}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Simulation Controls</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setIsFailureMode(!isFailureMode)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border-2",
                    isFailureMode 
                      ? "bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-500/10" 
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  )}
                >
                  <Zap className={cn("w-5 h-5", isFailureMode && "fill-current")} />
                  {isFailureMode ? "Stop Failure Simulation" : "Trigger Failure Drift"}
                </button>
                
                <button 
                  onClick={() => setData([])}
                  className="w-full py-4 rounded-2xl font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <History className="w-5 h-5" />
                  Reset Telemetry
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Model Version</span>
                <span className="text-white">v1.0.4-stable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature */}
          <SensorCard 
            title="Temperature" 
            value={data[data.length - 1]?.temperature || 0} 
            unit="°C" 
            icon={<Thermometer />}
            color="#3b82f6"
            data={data}
            dataKey="temperature"
            threshold={55}
          />
          {/* Vibration */}
          <SensorCard 
            title="Vibration" 
            value={data[data.length - 1]?.vibration || 0} 
            unit="mm/s" 
            icon={<Waves />}
            color="#a855f7"
            data={data}
            dataKey="vibration"
            threshold={4}
          />
          {/* Current */}
          <SensorCard 
            title="Current" 
            value={data[data.length - 1]?.current || 0} 
            unit="Amps" 
            icon={<Zap />}
            color="#eab308"
            data={data}
            dataKey="current"
            threshold={15}
          />
        </div>

        {/* Main Telemetry Chart */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Sensor Correlation</h3>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-400">Temp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-slate-400">Vib</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-slate-400">Curr</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
                <Line type="monotone" dataKey="vibration" stroke="#a855f7" strokeWidth={3} dot={false} animationDuration={300} />
                <Line type="monotone" dataKey="current" stroke="#eab308" strokeWidth={3} dot={false} animationDuration={300} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Industrial Safety Protocol Active</span>
          </div>
          <p className="text-slate-600 text-xs">
            © 2026 AI-Powered Predictive Maintenance System. Built for GitHub Portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- Sub-components ---

function SensorCard({ title, value, unit, icon, color, data, dataKey, threshold }: any) {
  const isAlert = value > threshold;

  return (
    <motion.div 
      layout
      className={cn(
        "rounded-3xl p-6 border transition-all duration-300",
        isAlert 
          ? "bg-red-500/5 border-red-500/30 shadow-lg shadow-red-500/5" 
          : "bg-white/5 border-white/10 hover:border-white/20"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-2 rounded-xl",
          isAlert ? "bg-red-500/20 text-red-500" : "bg-slate-800 text-slate-400"
        )}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        {isAlert && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter"
          >
            <AlertTriangle className="w-3 h-3" />
            Threshold Exceeded
          </motion.div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className={cn(
            "text-3xl font-black tracking-tight",
            isAlert ? "text-red-500" : "text-white"
          )}>
            {value}
          </h4>
          <span className="text-sm font-medium text-slate-500">{unit}</span>
        </div>
      </div>

      <div className="mt-6 h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#grad-${dataKey})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
