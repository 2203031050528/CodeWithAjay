import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { HiChat, HiX, HiPaperAirplane, HiTrash, HiSparkles } from 'react-icons/hi';

const AIChatPanel = ({ courseId, videoId, courseName, videoTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Load chat history when panel opens
  useEffect(() => {
    if (isOpen && !historyLoaded && courseId) {
      loadHistory();
    }
  }, [isOpen, courseId]);

  const loadHistory = async () => {
    try {
      const { data } = await API.get(`/ai/history/${courseId}?limit=50`);
      setMessages(data.data || []);
      setHistoryLoaded(true);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim(), _id: Date.now(), createdAt: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', {
        courseId, videoId, message: userMsg.content,
      });
      setMessages(prev => [...prev, data.data]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get AI response';
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}`, _id: Date.now() + 1 }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history for this course?')) return;
    try {
      await API.delete(`/ai/history/${courseId}`);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        id="ai-chat-toggle"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
        }}
      >
        <HiChat className="text-white text-2xl" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col animate-slide-up"
      style={{
        width: '380px', maxWidth: 'calc(100vw - 32px)',
        height: '520px', maxHeight: 'calc(100vh - 120px)',
        background: 'rgba(15, 13, 26, 0.98)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
        borderRadius: '16px 16px 0 0',
      }}>
        <div className="flex items-center gap-2">
          <HiSparkles className="text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Ajay AI</h3>
            <p className="text-[10px] text-slate-500">Ask doubts about this lesson</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button onClick={clearHistory} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer">
              <HiTrash className="text-sm" />
            </button>
          )}
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
            <HiX className="text-lg" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <HiSparkles className="text-3xl text-indigo-400/50 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">Ask me anything about coding!</p>
            <p className="text-slate-600 text-xs mt-1">I can explain concepts, debug code, and more.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] p-3 rounded-xl text-sm"
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'rgba(30, 27, 50, 0.8)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(99, 102, 241, 0.1)',
                color: msg.role === 'user' ? '#fff' : '#e2e8f0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(30, 27, 50, 0.8)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            className="flex-1 resize-none text-sm text-white placeholder-slate-500 p-3 rounded-xl outline-none"
            style={{
              background: 'rgba(30, 27, 50, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              maxHeight: '80px',
            }}
            id="ai-chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl transition-all cursor-pointer"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(30, 27, 50, 0.6)',
              border: 'none',
              opacity: !input.trim() || loading ? 0.5 : 1,
            }}
            id="ai-chat-send"
          >
            <HiPaperAirplane className="text-white text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
