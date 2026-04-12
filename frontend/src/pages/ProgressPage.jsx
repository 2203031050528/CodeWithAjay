import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useProgress from '../hooks/useProgress';
import API from '../api/axios';
import ProgressBar from '../components/ProgressBar';
import StatsCard from '../components/StatsCard';
import { HiClock, HiChartBar, HiCheckCircle, HiCalendar, HiBookOpen } from 'react-icons/hi';

const ProgressPage = () => {
  const { user } = useAuth();
  const { getProgress, getDailyStats } = useProgress();
  const [courseProgress, setCourseProgress] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch daily stats
        const daily = await getDailyStats();
        setDailyStats(daily || []);

        // Fetch progress per purchased course
        if (user?.purchasedCourses?.length > 0) {
          const courseIds = user.purchasedCourses.map(c => typeof c === 'object' ? c._id : c);
          const coursesRes = await API.get('/courses');
          const allCourses = coursesRes.data.data;

          const progressResults = await Promise.all(
            courseIds.map(async (cId) => {
              const progress = await getProgress(cId);
              const courseInfo = allCourses.find(c => c._id === cId);
              return {
                courseId: cId,
                courseName: courseInfo?.title || 'Unknown Course',
                ...progress?.stats,
                details: progress?.progress || [],
              };
            })
          );
          setCourseProgress(progressResults);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const totalCompleted = courseProgress.reduce((a, c) => a + (c.completedVideos || 0), 0);
  const totalVideos = courseProgress.reduce((a, c) => a + (c.totalVideos || 0), 0);
  const totalTimeAll = courseProgress.reduce((a, c) => a + (c.totalTimeSpent || 0), 0);

  // Get max time for daily chart scaling
  const maxDailyTime = Math.max(...dailyStats.map(d => d.totalTime), 1);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{
          borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent',
        }}></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Learning Progress</h1>
      <p className="text-slate-400 text-sm mb-8">Track how you're doing across all your courses</p>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard icon={<HiBookOpen />} label="Courses Enrolled" value={courseProgress.length} color="#6366f1" />
        <StatsCard icon={<HiCheckCircle />} label="Videos Completed" value={totalCompleted} color="#10b981" />
        <StatsCard icon={<HiClock />} label="Total Time" value={Math.floor(totalTimeAll / 60)} suffix="m" color="#06b6d4" />
        <StatsCard icon={<HiChartBar />} label="Overall Progress" value={totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0} suffix="%" color="#f59e0b" />
      </div>

      {/* Daily Activity Chart */}
      {dailyStats.length > 0 && (
        <div className="glass p-6 mb-10 animate-fade-in">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <HiCalendar className="text-primary-400" /> Last 7 Days Activity
          </h2>
          <p className="text-slate-500 text-xs mb-6">Your daily learning time</p>

          <div className="flex items-end gap-3 justify-center" style={{ height: '180px' }}>
            {dailyStats.map((day, i) => {
              const height = Math.max((day.totalTime / maxDailyTime) * 150, 8);
              const date = new Date(day._id);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });

              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                  <span className="text-xs text-slate-400">{formatTime(day.totalTime)}</span>
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${height}px`,
                      background: 'linear-gradient(180deg, #6366f1, #4f46e5)',
                      minWidth: '24px',
                      opacity: 0.8 + (0.2 * (day.totalTime / maxDailyTime)),
                    }}
                  />
                  <span className="text-xs text-slate-500">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course-wise Progress */}
      {courseProgress.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <HiChartBar className="text-cyan-400" /> Course-wise Progress
          </h2>

          {courseProgress.map((cp, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-white font-semibold text-base">{cp.courseName}</h3>
                  <p className="text-slate-500 text-xs mt-1">
                    {cp.completedVideos || 0}/{cp.totalVideos || 0} videos • {formatTime(cp.totalTimeSpent || 0)} watched
                  </p>
                </div>
                <span className="text-2xl font-bold gradient-text">{cp.percentComplete || 0}%</span>
              </div>

              <ProgressBar percent={cp.percentComplete || 0} size="md" />

              {/* Video details */}
              {cp.details.length > 0 && (
                <div className="mt-4 space-y-2">
                  {cp.details.map((d, j) => (
                    <div key={j} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{
                      background: 'rgba(15, 13, 26, 0.3)',
                    }}>
                      <div className="flex items-center gap-2">
                        {d.completed ? (
                          <HiCheckCircle className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-300">{d.videoId?.title || 'Video'}</span>
                      </div>
                      <span className="text-xs text-slate-500">{formatTime(d.timeSpent)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <HiChartBar className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No progress yet</p>
          <p className="text-slate-500 text-sm mt-1">Purchase a course and start watching to track your progress</p>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
