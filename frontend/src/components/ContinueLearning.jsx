import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { HiPlay, HiClock } from 'react-icons/hi';
import ProgressBar from './ProgressBar';

const ContinueLearning = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContinue = async () => {
      try {
        const { data } = await API.get('/progress/continue');
        setItems(data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchContinue();
  }, []);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading || items.length === 0) return null;

  return (
    <div className="mb-10 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <HiPlay className="text-primary-400" /> Continue Learning
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 3).map((item) => (
          <Link key={item.courseId} to={`/course/${item.courseId}`} className="no-underline">
            <div className="glass-card p-4 hover:border-indigo-500/30 transition-all group cursor-pointer">
              <p className="text-white font-medium text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                {item.courseTitle}
              </p>
              <p className="text-slate-500 text-xs mb-3 flex items-center gap-1">
                <HiPlay className="text-primary-400 text-[10px]" /> {item.videoTitle}
              </p>
              <ProgressBar percent={item.percentComplete} size="sm" />
              <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                <HiClock /> Last watched {timeAgo(item.lastWatchedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
