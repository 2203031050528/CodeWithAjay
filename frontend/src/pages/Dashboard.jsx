import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import CourseCard from '../components/CourseCard';
import useProgress from '../hooks/useProgress';
import GamificationBadge from '../components/GamificationBadge';
import StreakDisplay from '../components/StreakDisplay';
import ContinueLearning from '../components/ContinueLearning';
import { HiBookOpen, HiClock, HiChartBar, HiAcademicCap, HiShare, HiClipboardCopy, HiCheck, HiLightningBolt, HiFire } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [gamification, setGamification] = useState(null);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const { getProgress } = useProgress();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser();
        const { data } = await API.get('/courses');
        setCourses(data.data);

        // Fetch progress for purchased courses
        if (user?.purchasedCourses?.length > 0) {
          const progressPromises = user.purchasedCourses.map(async (courseId) => {
            const progressData = await getProgress(courseId);
            return { courseId, progress: progressData };
          });
          const results = await Promise.all(progressPromises);
          const map = {};
          results.forEach(({ courseId, progress }) => {
            if (progress?.stats) {
              map[courseId] = progress.stats.percentComplete;
            }
          });
          setProgressMap(map);
        }

        // Fetch referral stats
        try {
          const { data: refData } = await API.get('/coupons/my-stats');
          setReferralStats(refData.data);
        } catch (err) {
          console.error('Failed to load referral stats:', err);
        }

        // Fetch gamification profile
        try {
          const { data: gamData } = await API.get('/gamification/profile');
          setGamification(gamData.data);
          // Check if daily login already claimed today
          const lastClaimed = gamData.data?.streak?.isActiveToday;
          setDailyClaimed(!!lastClaimed);
        } catch (err) {
          console.error('Failed to load gamification:', err);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);;

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const purchasedCourseIds = user?.purchasedCourses?.map(c => typeof c === 'object' ? c._id : c) || [];
  const enrolledCourses = courses.filter(c => purchasedCourseIds.includes(c._id));
  const availableCourses = courses.filter(c => !purchasedCourseIds.includes(c._id));

  const avgProgress = enrolledCourses.length > 0
    ? Math.round(Object.values(progressMap).reduce((a, b) => a + b, 0) / enrolledCourses.length)
    : 0;

  const handleCopyReferral = () => {
    if (referralStats?.referralLink) {
      navigator.clipboard.writeText(referralStats.referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimDaily = async () => {
    try {
      const { data } = await API.post('/gamification/claim-daily');
      toast.success(`+${data.data.xpEarned} XP earned! 🎉`);
      setDailyClaimed(true);
      // Refresh gamification data
      const { data: gamData } = await API.get('/gamification/profile');
      setGamification(gamData.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim');
    }
  };

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
      {/* Welcome Banner */}
      <div className="glass p-6 sm:p-8 mb-8 animate-fade-in" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))',
      }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
            </h1>
            <p className="text-slate-400 text-sm">Keep up the great work on your learning journey</p>
            {gamification && (
              <div className="mt-2">
                <GamificationBadge xp={gamification.xp} level={gamification.level} size="md" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!dailyClaimed && (
              <button onClick={handleClaimDaily} className="text-sm px-4 py-2 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.15))', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}
                id="claim-daily-btn">
                <HiFire /> Claim Daily XP
              </button>
            )}
            <Link to="/progress" className="gradient-btn text-sm no-underline">
              <HiChartBar /> View Progress
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<HiBookOpen />} label="Enrolled Courses" value={enrolledCourses.length} color="#6366f1" />
        <StatsCard icon={<HiChartBar />} label="Avg. Progress" value={avgProgress} suffix="%" color="#06b6d4" />
        <StatsCard icon={<HiLightningBolt />} label="Total XP" value={gamification?.xp || 0} color="#f59e0b" />
        <StatsCard icon={<HiAcademicCap />} label="Completed" value={Object.values(progressMap).filter(p => p === 100).length} color="#10b981" />
      </div>

      {/* Streak + XP Progress */}
      {gamification && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <StreakDisplay
            currentStreak={gamification.streak?.currentStreak || 0}
            longestStreak={gamification.streak?.longestStreak || 0}
          />
          {/* XP Progress to next level */}
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 mb-2">Progress to {gamification.nextLevel || 'Max Level'}</p>
            <div className="w-full h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(15, 13, 26, 0.6)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${Math.min(gamification.xpProgress || 0, 100)}%`,
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              }} />
            </div>
            <p className="text-xs text-slate-500">
              {gamification.nextLevel ? `${gamification.xpNeeded} XP to ${gamification.nextLevel}` : '🏆 Max level reached!'}
            </p>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <ContinueLearning />

      {/* Referral Section — only visible to partners and admins */}
      {referralStats?.eligible && referralStats?.referralCode && (
        <div className="glass p-6 mb-10 animate-fade-in" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.15)',
        }}>
          <div className="flex items-center gap-2 mb-4">
            <HiShare className="text-emerald-400 text-lg" />
            <h3 className="text-base font-semibold text-white">Your Referral Program</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Share your referral link and give your friends a <span className="text-emerald-400 font-medium">10% discount</span> on any course!
          </p>

          {/* Referral Link */}
          <div className="flex items-stretch gap-2 mb-5">
            <div className="flex-1 p-3 rounded-lg text-sm font-mono truncate" style={{
              background: 'rgba(15, 13, 26, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              color: '#94a3b8',
            }}>
              {referralStats.referralLink}
            </div>
            <button
              onClick={handleCopyReferral}
              className="px-4 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
              id="copy-referral-btn"
              style={{
                background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                color: copied ? '#34d399' : '#a5b4fc',
              }}
            >
              {copied ? <><HiCheck /> Copied</> : <><HiClipboardCopy /> Copy</>}
            </button>
          </div>

          {/* Referral Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl text-center" style={{
              background: 'rgba(15, 13, 26, 0.5)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}>
              <p className="text-2xl font-bold text-white">{referralStats.totalUses}</p>
              <p className="text-slate-500 text-xs mt-1">Total Referrals</p>
            </div>
            <div className="p-4 rounded-xl text-center" style={{
              background: 'rgba(15, 13, 26, 0.5)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}>
              <p className="text-2xl font-bold text-emerald-400">₹{referralStats.totalEarnings}</p>
              <p className="text-slate-500 text-xs mt-1">Discounts Given</p>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <HiBookOpen className="text-primary-400" /> My Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                hasPurchased={true}
                progress={progressMap[course._id] || 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Courses */}
      {availableCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <HiAcademicCap className="text-cyan-400" /> Explore Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                hasPurchased={false}
              />
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-20">
          <HiBookOpen className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No courses available yet</p>
          <p className="text-slate-500 text-sm mt-1">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

