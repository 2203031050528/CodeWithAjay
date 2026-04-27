import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { HiBell, HiCheck, HiX } from 'react-icons/hi';

const NOTIF_ICONS = {
  course_purchase: '🎉', course_complete: '🏆', new_content: '📚', xp_earned: '✨',
  level_up: '⚡', streak_milestone: '🔥', certificate: '📜', comment_reply: '💬',
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/notifications/unread-count');
      setUnreadCount(data.data.count);
    } catch (err) { /* silent */ }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notifications?limit=15');
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleDropdown = () => {
    if (!isOpen) fetchNotifications();
    setIsOpen(!isOpen);
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
        id="notification-bell"
      >
        <HiBell className="text-xl text-slate-400 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-xl shadow-xl z-50 custom-scrollbar"
          style={{
            background: 'rgba(15, 13, 26, 0.98)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}>
          {/* Header */}
          <div className="flex items-center justify-between p-3" style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h4 className="text-sm font-semibold text-white">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer flex items-center gap-1">
                <HiCheck /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full animate-spin" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className="p-3 flex items-start gap-3 hover:bg-white/3 transition-colors cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(99, 102, 241, 0.05)',
                  background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                }}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{NOTIF_ICONS[n.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${n.isRead ? 'text-slate-400' : 'text-white'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
