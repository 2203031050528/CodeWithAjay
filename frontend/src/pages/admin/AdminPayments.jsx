import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HiArrowLeft } from 'react-icons/hi';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPayments = async () => {
    try {
      const { data } = await API.get(`/admin/payments?page=${page}&limit=20`);
      setPayments(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [page]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusBadge = (status) => {
    const map = {
      paid: 'badge-success',
      created: 'badge-warning',
      failed: 'badge-error',
    };
    return `badge ${map[status] || 'badge-info'}`;
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
      <div className="flex items-center gap-3 mb-2">
        <Link to="/admin" className="text-slate-400 hover:text-white transition-colors"><HiArrowLeft className="text-lg" /></Link>
        <h1 className="text-2xl font-bold text-white">Payment History</h1>
      </div>
      <p className="text-slate-400 text-sm mb-6 ml-8">All payment transactions on the platform</p>

      {/* Payments Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>
                  <div>
                    <p className="text-white font-medium text-sm">{payment.userId?.name || 'Unknown'}</p>
                    <p className="text-slate-500 text-xs">{payment.userId?.email}</p>
                  </div>
                </td>
                <td className="text-slate-300">{payment.courseId?.title || 'Unknown'}</td>
                <td className="text-white font-semibold">₹{payment.amount}</td>
                <td>
                  <span className={statusBadge(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="text-slate-500 text-xs font-mono">{payment.razorpayPaymentId || '—'}</td>
                <td className="text-slate-400 text-sm">{formatDate(payment.createdAt)}</td>
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

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No payments yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
