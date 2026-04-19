import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiSearch, HiCheckCircle, HiXCircle, HiStar } from 'react-icons/hi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(`/admin/users?page=${page}&limit=20`);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleMakePartner = async (userId, userName) => {
    if (!window.confirm(`Promote "${userName}" to Partner? They will be able to generate referral codes.`)) return;
    try {
      const { data } = await API.put(`/admin/make-partner/${userId}`);
      toast.success(data.message || `${userName} is now a Partner!`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const filteredUsers = search
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

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
      <div className="flex items-center gap-3 mb-2">
        <Link to="/admin" className="text-slate-400 hover:text-white transition-colors"><HiArrowLeft className="text-lg" /></Link>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
      </div>
      <p className="text-slate-400 text-sm mb-6 ml-8">View all registered users and their purchase history</p>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !pl-11"
          placeholder="Search by name or email..."
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Purchased</th>
              <th>Time Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="text-slate-400">{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'partner' ? 'badge-info' : 'badge-warning'}`}>
                    {user.role === 'partner' ? <><HiStar className="mr-1" /> Partner</> : 'User'}
                  </span>
                </td>
                <td>
                  {user.purchasedCourses?.length > 0 ? (
                    <span className="badge badge-success">
                      <HiCheckCircle className="mr-1" /> {user.purchasedCourses.length} course(s)
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      <HiXCircle className="mr-1" /> None
                    </span>
                  )}
                </td>
                <td className="text-slate-300">{formatTime(user.totalTimeSpent)}</td>
                <td className="text-slate-400">{formatDate(user.createdAt)}</td>
                <td>
                  {user.role !== 'partner' ? (
                    <button
                      onClick={() => handleMakePartner(user._id, user.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                      id={`make-partner-${user._id}`}
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                      }}
                    >
                      <HiStar /> Make Partner
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <HiCheckCircle /> Partner
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent text-slate-300"
            style={{ border: '1px solid rgba(99, 102, 241, 0.2)', opacity: page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent text-slate-300"
            style={{ border: '1px solid rgba(99, 102, 241, 0.2)', opacity: page === pagination.pages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
