import { HiLightningBolt, HiTrendingUp } from 'react-icons/hi';

const LEVEL_COLORS = {
  Beginner: { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)' },
  Intermediate: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9', border: 'rgba(6, 182, 212, 0.3)' },
  Pro: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' },
  Expert: { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
};

const GamificationBadge = ({ xp, level, size = 'sm', showXP = true }) => {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
          background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
        }}>
          {level}
        </span>
        {showXP && (
          <span className="flex items-center gap-0.5 text-xs text-amber-400">
            <HiLightningBolt className="text-[10px]" /> {xp}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{
        background: colors.bg, border: `1px solid ${colors.border}`,
      }}>
        <HiTrendingUp style={{ color: colors.text }} />
        <span className="text-sm font-semibold" style={{ color: colors.text }}>{level}</span>
      </div>
      {showXP && (
        <div className="flex items-center gap-1 text-sm">
          <HiLightningBolt className="text-amber-400" />
          <span className="font-semibold text-amber-300">{xp?.toLocaleString()}</span>
          <span className="text-slate-500">XP</span>
        </div>
      )}
    </div>
  );
};

export default GamificationBadge;
