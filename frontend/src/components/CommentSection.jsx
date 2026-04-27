import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { HiHeart, HiReply, HiTrash, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import GamificationBadge from './GamificationBadge';

const CommentItem = ({ comment, onDelete, onLike, depth = 0 }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(comment.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/comments/${comment._id}/like`);
      setLiked(data.data.liked);
      setLikeCount(data.data.likeCount);
      if (onLike) onLike(comment._id, data.data);
    } catch (err) { console.error(err); }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${comment._id}/reply`, { content: replyContent });
      setReplies(prev => [...prev, data.data]);
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4' : ''}`} style={depth > 0 ? { borderLeft: '2px solid rgba(99, 102, 241, 0.1)' } : {}}>
      <div className="p-3 rounded-xl mb-2" style={{ background: 'rgba(15, 13, 26, 0.4)', border: '1px solid rgba(99, 102, 241, 0.06)' }}>
        {/* Author */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {comment.userId?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-sm font-medium text-white">{comment.userId?.name || 'User'}</span>
            {comment.userId?.level && <GamificationBadge level={comment.userId.level} xp={0} showXP={false} size="sm" />}
            <span className="text-xs text-slate-600">{timeAgo(comment.createdAt)}</span>
            {comment.isEdited && <span className="text-[10px] text-slate-600">(edited)</span>}
          </div>
          {(user?._id === comment.userId?._id || user?.role === 'admin') && (
            <button onClick={() => onDelete(comment._id)} className="text-slate-600 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer p-1">
              <HiTrash className="text-sm" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-slate-300 mb-2 whitespace-pre-wrap">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1 text-xs bg-transparent border-none cursor-pointer transition-colors ${liked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'}`}>
            <HiHeart className={liked ? 'fill-current' : ''} /> {likeCount > 0 && likeCount}
          </button>
          {depth === 0 && (
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 bg-transparent border-none cursor-pointer transition-colors">
              <HiReply /> Reply
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 flex gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 text-sm text-white placeholder-slate-500 p-2 rounded-lg outline-none"
              style={{ background: 'rgba(30, 27, 50, 0.6)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            />
            <button onClick={handleReply} disabled={submitting} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}>
              {submitting ? '...' : 'Reply'}
            </button>
          </div>
        )}
      </div>

      {/* Replies toggle */}
      {comment.totalReplies > 0 && depth === 0 && (
        <button onClick={() => setShowReplies(!showReplies)} className="text-xs text-indigo-400 hover:text-indigo-300 ml-3 mb-2 bg-transparent border-none cursor-pointer flex items-center gap-1">
          {showReplies ? <HiChevronUp /> : <HiChevronDown />}
          {showReplies ? 'Hide' : `Show ${comment.totalReplies}`} {comment.totalReplies === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {/* Nested replies */}
      {showReplies && replies.map(reply => (
        <CommentItem key={reply._id} comment={reply} onDelete={onDelete} onLike={onLike} depth={depth + 1} />
      ))}
    </div>
  );
};

const CommentSection = ({ courseId, videoId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComments = async (pageNum = 1) => {
    try {
      const url = `/comments/${courseId}?page=${pageNum}&limit=10${videoId ? `&videoId=${videoId}` : ''}`;
      const { data } = await API.get(url);
      if (pageNum === 1) setComments(data.data);
      else setComments(prev => [...prev, ...data.data]);
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useState(() => { fetchComments(); }, [courseId, videoId]);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await API.post('/comments', { courseId, videoId, content });
      setComments(prev => [data.data, ...prev]);
      setContent('');
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="glass p-4 sm:p-6 mt-6">
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        💬 Discussion ({comments.length})
      </h3>

      {/* Post form */}
      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a question or thought..."
          rows={3}
          className="w-full text-sm text-white placeholder-slate-500 p-3 rounded-xl outline-none resize-none mb-2"
          style={{ background: 'rgba(15, 13, 26, 0.5)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
          id="comment-input"
        />
        <button onClick={handleSubmit} disabled={!content.trim() || submitting} className="gradient-btn text-sm" id="comment-submit">
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-1">
          {comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} onDelete={handleDelete} />
          ))}
          {hasMore && (
            <button onClick={() => { setPage(p => p + 1); fetchComments(page + 1); }}
              className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 py-3 bg-transparent border-none cursor-pointer">
              Load more comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
