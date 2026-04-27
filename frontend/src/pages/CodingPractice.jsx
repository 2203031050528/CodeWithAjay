import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { HiCode, HiCheckCircle, HiLightningBolt, HiFilter } from 'react-icons/hi';

const DIFF_COLORS = {
  easy: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
};

const STATUS_ICONS = { passed: '✅', failed: '❌', error: '⚠️', unattempted: '⬜' };

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const url = filter === 'all' ? '/coding/problems' : `/coding/problems?difficulty=${filter}`;
        const { data } = await API.get(url);
        setProblems(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProblems();
  }, [filter]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <HiCode className="text-primary-400" /> Coding Practice
          </h1>
          <p className="text-slate-400 text-sm mt-1">Solve problems, earn XP, level up your skills</p>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          <HiFilter className="text-slate-500" />
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all`}
              style={{
                background: filter === d ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 13, 26, 0.5)',
                border: `1px solid ${filter === d ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.08)'}`,
                color: filter === d ? '#a5b4fc' : '#94a3b8',
              }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-20">
          <HiCode className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No problems available yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((problem, i) => {
            const dc = DIFF_COLORS[problem.difficulty] || DIFF_COLORS.easy;
            return (
              <Link key={problem._id} to={`/coding/${problem._id}`} className="no-underline">
                <div className="glass-card p-4 sm:p-5 flex items-center justify-between hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-lg">{STATUS_ICONS[problem.userStatus] || STATUS_ICONS.unattempted}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {i + 1}. {problem.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{problem.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                      background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`,
                    }}>
                      {problem.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <HiLightningBolt /> {problem.xpReward}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CodingPractice;
