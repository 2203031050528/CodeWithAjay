import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { HiChartBar, HiCurrencyRupee, HiUsers, HiAcademicCap } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminAnalytics = () => {
  const [revenue, setRevenue] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [levelDist, setLevelDist] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [revRes, userRes, courseRes] = await Promise.all([
          API.get('/admin/analytics/revenue'),
          API.get('/admin/analytics/users'),
          API.get('/admin/analytics/courses'),
        ]);
        setRevenue(revRes.data.data);
        setUserGrowth(userRes.data.data.userGrowth);
        setLevelDist(userRes.data.data.levelDistribution);
        setCourseStats(courseRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(99, 102, 241, 0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(99, 102, 241, 0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
    },
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const revenueData = {
    labels: revenue.map(r => new Date(r._id).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [{ label: 'Revenue (₹)', data: revenue.map(r => r.total), borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4 }],
  };

  const userGrowthData = {
    labels: userGrowth.map(u => new Date(u._id).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [{ label: 'New Users', data: userGrowth.map(u => u.count), backgroundColor: 'rgba(6, 182, 212, 0.6)', borderColor: '#06b6d4', borderWidth: 1 }],
  };

  const LEVEL_COLORS = { Beginner: '#6366f1', Intermediate: '#06b6d4', Pro: '#f59e0b', Expert: '#ef4444' };
  const levelData = {
    labels: levelDist.map(l => l._id || 'Beginner'),
    datasets: [{ data: levelDist.map(l => l.count), backgroundColor: levelDist.map(l => LEVEL_COLORS[l._id] || '#6366f1'), borderWidth: 0 }],
  };

  const totalRev = revenue.reduce((a, r) => a + r.total, 0);
  const totalNewUsers = userGrowth.reduce((a, u) => a + u.count, 0);

  return (
    <div className="page-container">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <HiChartBar className="text-primary-400" /> Analytics Dashboard
      </h1>
      <p className="text-slate-400 text-sm mb-8">Last 30 days performance overview</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><HiCurrencyRupee className="text-indigo-400" /><span className="text-xs text-slate-500">Revenue (30d)</span></div>
          <p className="text-2xl font-bold text-white">₹{totalRev.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><HiUsers className="text-cyan-400" /><span className="text-xs text-slate-500">New Users (30d)</span></div>
          <p className="text-2xl font-bold text-white">{totalNewUsers}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><HiAcademicCap className="text-amber-400" /><span className="text-xs text-slate-500">Total Courses</span></div>
          <p className="text-2xl font-bold text-white">{courseStats.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
          <div style={{ height: '250px' }}>{revenue.length > 0 ? <Line data={revenueData} options={chartOptions} /> : <p className="text-slate-500 text-sm text-center py-16">No revenue data</p>}</div>
        </div>
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-white mb-4">User Growth</h3>
          <div style={{ height: '250px' }}>{userGrowth.length > 0 ? <Bar data={userGrowthData} options={chartOptions} /> : <p className="text-slate-500 text-sm text-center py-16">No user data</p>}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level distribution */}
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-white mb-4">User Level Distribution</h3>
          <div style={{ height: '250px' }} className="flex items-center justify-center">
            {levelDist.length > 0 ? <Doughnut data={levelData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } } } }} /> : <p className="text-slate-500 text-sm">No data</p>}
          </div>
        </div>

        {/* Course performance table */}
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Course Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-xs text-slate-500">
                <th className="py-2 pr-3">Course</th><th className="py-2 px-2">Enrolled</th><th className="py-2 px-2">Revenue</th><th className="py-2 px-2">Completions</th>
              </tr></thead>
              <tbody>
                {courseStats.map(c => (
                  <tr key={c.courseId} className="text-sm" style={{ borderTop: '1px solid rgba(99, 102, 241, 0.06)' }}>
                    <td className="py-2 pr-3 text-white font-medium text-xs">{c.title}</td>
                    <td className="py-2 px-2 text-slate-400 text-xs">{c.enrollments}</td>
                    <td className="py-2 px-2 text-emerald-400 text-xs">₹{c.revenue}</td>
                    <td className="py-2 px-2 text-slate-400 text-xs">{c.completions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
