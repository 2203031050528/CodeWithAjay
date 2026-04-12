import { useEffect, useState } from 'react';

const StatsCard = ({ icon, label, value, color = '#6366f1', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
    if (numValue === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{
          background: `${color}15`,
          color: color,
        }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1" style={{ animation: 'countUp 0.5s ease forwards' }}>
        {typeof value === 'string' && value.startsWith('₹') ? '₹' : ''}{displayValue}{suffix}
      </p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
};

export default StatsCard;
