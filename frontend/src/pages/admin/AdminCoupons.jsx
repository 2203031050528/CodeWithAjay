import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiPlus, HiX, HiTag, HiCheck, HiBan } from 'react-icons/hi';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'coupon',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiryDate: '',
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get(`/admin/coupons?page=${page}&limit=20`);
      setCoupons(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/coupons/create', {
        ...form,
        discountValue: Number(form.discountValue),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiryDate: form.expiryDate || null,
      });
      toast.success('Coupon created successfully!');
      setShowCreate(false);
      setForm({ code: '', type: 'coupon', discountType: 'percentage', discountValue: '', usageLimit: '', expiryDate: '' });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/admin/coupons/${id}/toggle`);
      fetchCoupons();
      toast.success('Coupon status updated');
    } catch (error) {
      toast.error('Failed to toggle coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await API.delete(`/admin/coupons/${id}`);
      fetchCoupons();
      toast.success('Coupon deleted');
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-slate-400 hover:text-white transition-colors"><HiArrowLeft className="text-lg" /></Link>
          <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="gradient-btn text-sm"
          id="toggle-create-coupon"
        >
          {showCreate ? <><HiX /> Cancel</> : <><HiPlus /> Create Coupon</>}
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6 ml-8">Manage coupons and view referral codes</p>

      {/* Create Coupon Form */}
      {showCreate && (
        <div className="glass p-6 mb-8 animate-slide-up" style={{
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <HiTag className="text-primary-400" /> New Coupon
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="input-field text-sm"
                placeholder="e.g., SAVE20"
                required
                id="coupon-code-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field text-sm"
                id="coupon-type-select"
              >
                <option value="coupon">Coupon</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="input-field text-sm"
                id="discount-type-select"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Discount Value {form.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="input-field text-sm"
                placeholder={form.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 10'}
                required
                min="0"
                id="discount-value-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Usage Limit (optional)</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className="input-field text-sm"
                placeholder="Leave empty for unlimited"
                min="1"
                id="usage-limit-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry Date (optional)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="input-field text-sm"
                id="expiry-date-input"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="gradient-btn text-sm"
                id="submit-create-coupon"
                style={{ opacity: creating ? 0.7 : 1 }}
              >
                {creating ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>
                  <span className="font-mono text-sm text-white font-semibold">{coupon.code}</span>
                </td>
                <td>
                  <span className={`badge ${coupon.type === 'referral' ? 'badge-info' : 'badge-warning'}`}>
                    {coupon.type}
                  </span>
                </td>
                <td className="text-slate-300 text-sm">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </td>
                <td className="text-slate-300 text-sm">
                  {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' / ∞'}
                </td>
                <td>
                  <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-error'}`}>
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="text-slate-400 text-sm">{formatDate(coupon.expiryDate)}</td>
                <td className="text-slate-400 text-sm">{coupon.createdBy?.name || '—'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(coupon._id)}
                      className="p-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
                      title={coupon.isActive ? 'Disable' : 'Enable'}
                      style={{
                        border: `1px solid ${coupon.isActive ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        color: coupon.isActive ? '#f43f5e' : '#10b981',
                      }}
                    >
                      {coupon.isActive ? <HiBan /> : <HiCheck />}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
                      title="Delete"
                      style={{
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        color: '#f43f5e',
                      }}
                    >
                      <HiX />
                    </button>
                  </div>
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

      {coupons.length === 0 && !showCreate && (
        <div className="text-center py-12">
          <HiTag className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No coupons yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="gradient-btn text-sm mt-4"
          >
            <HiPlus /> Create Your First Coupon
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
