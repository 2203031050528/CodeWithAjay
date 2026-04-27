import { HiFire } from 'react-icons/hi';

const StreakDisplay = ({ currentStreak = 0, longestStreak = 0, size = 'md', showLongest = true }) => {
  const isActive = currentStreak > 0;

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1">
        <HiFire className={`text-sm ${isActive ? 'text-orange-400' : 'text-slate-600'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-orange-300' : 'text-slate-500'}`}>
          {currentStreak}
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card p-4" style={{
      background: isActive
        ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(239, 68, 68, 0.05))'
        : 'rgba(15, 13, 26, 0.5)',
      border: `1px solid ${isActive ? 'rgba(251, 146, 60, 0.2)' : 'rgba(99, 102, 241, 0.08)'}`,
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`} style={{
            background: isActive ? 'rgba(251, 146, 60, 0.2)' : 'rgba(100, 116, 139, 0.15)',
          }}>
            <HiFire className={`text-xl ${isActive ? 'text-orange-400' : 'text-slate-600'}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Current Streak</p>
            <p className={`text-2xl font-bold ${isActive ? 'text-orange-300' : 'text-slate-500'}`}>
              {currentStreak} <span className="text-sm font-normal text-slate-500">days</span>
            </p>
          </div>
        </div>
      </div>
      {showLongest && (
        <p className="text-xs text-slate-600 mt-1">
          🏅 Longest: <span className="text-slate-400 font-medium">{longestStreak} days</span>
        </p>
      )}
    </div>
  );
};

export default StreakDisplay;
