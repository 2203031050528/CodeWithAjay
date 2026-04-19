import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import { HiUsers, HiCurrencyRupee, HiChartBar, HiBookOpen, HiCollection, HiCreditCard, HiArrowRight, HiTag } from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/dashboard');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{
          borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent',
        }}></div>
      </div>
    );
  }

  const quickLinks = [
    { to: '/admin/courses', icon: <HiBookOpen />, label: 'Manage Courses', color: '#6366f1' },
    { to: '/admin/users', icon: <HiUsers />, label: 'Manage Users', color: '#06b6d4' },
    { to: '/admin/payments', icon: <HiCreditCard />, label: 'View Payments', color: '#10b981' },
    { to: '/admin/coupons', icon: <HiTag />, label: 'Manage Coupons', color: '#f59e0b' },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your platform</p>
        </div>
        <div className="badge badge-info">Admin Panel</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatsCard icon={<HiUsers />} label="Total Users" value={stats?.totalUsers || 0} color="#6366f1" />
        <StatsCard icon={<HiCurrencyRupee />} label="Total Revenue" value={stats?.totalRevenue || 0} suffix="" color="#10b981" />
        <StatsCard icon={<HiChartBar />} label="Active Users (7d)" value={stats?.activeUsers || 0} color="#06b6d4" />
        <StatsCard icon={<HiCollection />} label="Total Courses" value={stats?.totalCourses || 0} color="#f59e0b" />
        <StatsCard icon={<HiCreditCard />} label="Total Payments" value={stats?.totalPayments || 0} color="#f43f5e" />
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <Link key={i} to={link.to} className="glass-card p-5 flex items-center justify-between group no-underline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{
                background: `${link.color}15`,
                color: link.color,
              }}>
                {link.icon}
              </div>
              <span className="text-white font-medium text-sm">{link.label}</span>
            </div>
            <HiArrowRight className="text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
