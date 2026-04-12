import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import CourseCard from '../components/CourseCard';
import useProgress from '../hooks/useProgress';
import { HiBookOpen, HiClock, HiChartBar, HiAcademicCap } from 'react-icons/hi';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          </div>
          <Link to="/progress" className="gradient-btn text-sm no-underline">
            <HiChartBar /> View Progress
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          icon={<HiBookOpen />}
          label="Enrolled Courses"
          value={enrolledCourses.length}
          color="#6366f1"
        />
        <StatsCard
          icon={<HiChartBar />}
          label="Avg. Progress"
          value={avgProgress}
          suffix="%"
          color="#06b6d4"
        />
        <StatsCard
          icon={<HiClock />}
          label="Time Spent"
          value={Math.floor((user?.totalTimeSpent || 0) / 60)}
          suffix="m"
          color="#10b981"
        />
        <StatsCard
          icon={<HiAcademicCap />}
          label="Completed"
          value={Object.values(progressMap).filter(p => p === 100).length}
          color="#f59e0b"
        />
      </div>

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
