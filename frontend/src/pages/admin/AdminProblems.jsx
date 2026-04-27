import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { HiCode, HiPlus, HiTrash, HiPencil } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'easy', starterCode: '', solutionCode: '', xpReward: 50, testCases: [{ input: '', expectedOutput: '', isHidden: false }] });

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await API.get('/coding/problems');
      setProblems(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addTestCase = () => setForm(f => ({ ...f, testCases: [...f.testCases, { input: '', expectedOutput: '', isHidden: false }] }));

  const updateTestCase = (idx, field, val) => {
    setForm(f => ({ ...f, testCases: f.testCases.map((tc, i) => i === idx ? { ...tc, [field]: val } : tc) }));
  };

  const removeTestCase = (idx) => setForm(f => ({ ...f, testCases: f.testCases.filter((_, i) => i !== idx) }));

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description || form.testCases.length === 0) {
        return toast.error('Title, description, and at least 1 test case required');
      }
      await API.post('/coding/problems', form);
      toast.success('Problem created!');
      setShowForm(false);
      setForm({ title: '', description: '', difficulty: 'easy', starterCode: '', solutionCode: '', xpReward: 50, testCases: [{ input: '', expectedOutput: '', isHidden: false }] });
      fetchProblems();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteProblem = async (id) => {
    if (!window.confirm('Delete this problem and all submissions?')) return;
    try {
      await API.delete(`/coding/problems/${id}`);
      toast.success('Deleted');
      setProblems(prev => prev.filter(p => p._id !== id));
    } catch (err) { toast.error('Failed to delete'); }
  };

  const inputStyle = {
    background: 'rgba(15, 13, 26, 0.5)', border: '1px solid rgba(99, 102, 241, 0.15)',
    color: '#fff', fontSize: '13px', padding: '8px 12px', borderRadius: '8px', outline: 'none', width: '100%',
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><HiCode className="text-primary-400" /> Manage Problems</h1>
          <p className="text-slate-400 text-sm mt-1">{problems.length} problems</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="gradient-btn text-sm flex items-center gap-1"><HiPlus /> New Problem</button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass p-6 mb-8 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4">Create New Problem</h3>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Problem Title" style={inputStyle} />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Problem Description (supports line breaks)" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            <div className="grid grid-cols-3 gap-3">
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
              <input type="number" value={form.xpReward} onChange={e => setForm(f => ({ ...f, xpReward: parseInt(e.target.value) || 50 }))} placeholder="XP Reward" style={inputStyle} />
            </div>
            <textarea value={form.starterCode} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))} placeholder="Starter Code" rows={3} style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
            <textarea value={form.solutionCode} onChange={e => setForm(f => ({ ...f, solutionCode: e.target.value }))} placeholder="Solution Code (admin reference)" rows={3} style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />

            {/* Test cases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Test Cases</span>
                <button onClick={addTestCase} className="text-xs text-indigo-400 bg-transparent border-none cursor-pointer">+ Add Test Case</button>
              </div>
              {form.testCases.map((tc, i) => (
                <div key={i} className="flex gap-2 mb-2 items-start">
                  <input value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)} placeholder="Input" style={{ ...inputStyle, flex: 1 }} />
                  <input value={tc.expectedOutput} onChange={e => updateTestCase(i, 'expectedOutput', e.target.value)} placeholder="Expected Output" style={{ ...inputStyle, flex: 1 }} />
                  <label className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0 mt-2">
                    <input type="checkbox" checked={tc.isHidden} onChange={e => updateTestCase(i, 'isHidden', e.target.checked)} /> Hidden
                  </label>
                  {form.testCases.length > 1 && (
                    <button onClick={() => removeTestCase(i)} className="text-red-400 text-sm bg-transparent border-none cursor-pointer mt-2"><HiTrash /></button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} className="gradient-btn">Create Problem</button>
          </div>
        </div>
      )}

      {/* Problems list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-2">
          {problems.map((p, i) => (
            <div key={p._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">{i + 1}. {p.title}</h4>
                <p className="text-xs text-slate-500">{p.difficulty} • {p.xpReward} XP</p>
              </div>
              <button onClick={() => deleteProblem(p._id)} className="text-slate-500 hover:text-red-400 bg-transparent border-none cursor-pointer p-2"><HiTrash /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProblems;
