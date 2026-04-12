const ProgressBar = ({ percent = 0, size = 'md', showLabel = true, color = 'primary' }) => {
  const colorMap = {
    primary: { bar: 'linear-gradient(90deg, #6366f1, #818cf8)', text: '#818cf8' },
    cyan: { bar: 'linear-gradient(90deg, #06b6d4, #22d3ee)', text: '#22d3ee' },
    emerald: { bar: 'linear-gradient(90deg, #10b981, #34d399)', text: '#34d399' },
  };

  const sizeMap = {
    sm: { height: '4px', fontSize: '0.7rem' },
    md: { height: '8px', fontSize: '0.8rem' },
    lg: { height: '12px', fontSize: '0.9rem' },
  };

  const clampedPercent = Math.min(100, Math.max(0, percent));
  const { bar, text } = colorMap[color] || colorMap.primary;
  const { height, fontSize } = sizeMap[size] || sizeMap.md;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400" style={{ fontSize }}>Progress</span>
          <span className="font-semibold" style={{ fontSize, color: text }}>{clampedPercent}%</span>
        </div>
      )}
      <div className="rounded-full overflow-hidden" style={{
        height,
        background: 'rgba(99, 102, 241, 0.1)',
      }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clampedPercent}%`,
            background: bar,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
