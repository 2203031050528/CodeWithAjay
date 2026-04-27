import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import { HiArrowLeft, HiPlay, HiCheckCircle, HiXCircle, HiLightningBolt, HiClock } from 'react-icons/hi';

const CodingProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await API.get(`/coding/problems/${id}`);
        setProblem(data.data);
        setCode(data.data.starterCode || '// Write your solution here\n');
        setSubmissions(data.submissions || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProblem();
  }, [id]);

  const submitCode = async () => {
    if (running) return;
    setRunning(true);
    setResults(null);
    try {
      const { data } = await API.post(`/coding/submit/${id}`, { code });
      setResults(data.data);
    } catch (err) {
      setResults({ status: 'error', results: [], error: err.response?.data?.message || 'Submission failed' });
    } finally { setRunning(false); }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-slate-400">Problem not found</p>
        <button onClick={() => navigate('/coding')} className="gradient-btn mt-4">Back to Problems</button>
      </div>
    );
  }

  const DIFF_COLORS = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/coding')} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer text-sm">
        <HiArrowLeft /> Back to Problems
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Problem description */}
        <div className="glass p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
              background: `${DIFF_COLORS[problem.difficulty]}20`,
              color: DIFF_COLORS[problem.difficulty],
              border: `1px solid ${DIFF_COLORS[problem.difficulty]}40`,
            }}>
              {problem.difficulty}
            </span>
          </div>

          <div className="text-sm text-slate-300 mb-6 whitespace-pre-wrap leading-relaxed">
            {problem.description}
          </div>

          {/* Visible test cases */}
          <h3 className="text-sm font-semibold text-white mb-3">Test Cases:</h3>
          <div className="space-y-2 mb-4">
            {problem.testCases.filter(tc => !tc.isHidden || tc.input !== '[Hidden]').map((tc, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(15, 13, 26, 0.5)', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
                {tc.input !== '[Hidden]' ? (
                  <>
                    <p className="text-xs text-slate-500">Input:</p>
                    <pre className="text-xs text-slate-300 font-mono mb-1">{tc.input}</pre>
                    <p className="text-xs text-slate-500">Expected Output:</p>
                    <pre className="text-xs text-emerald-400 font-mono">{tc.expectedOutput}</pre>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic">Hidden test case</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HiLightningBolt className="text-amber-400" />
            <span>{problem.xpReward} XP on first solve</span>
          </div>
        </div>

        {/* Right: Code editor + results */}
        <div className="space-y-4">
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Solution</h3>
              <span className="text-xs text-slate-500">JavaScript</span>
            </div>
            <CodeEditor code={code} onChange={setCode} height="350px" />
            <button onClick={submitCode} disabled={running} className="gradient-btn w-full mt-4 flex items-center justify-center gap-2" id="submit-code-btn">
              {running ? (
                <>
                  <div className="w-4 h-4 rounded-full animate-spin" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#fff', borderTopColor: 'transparent' }} />
                  Running...
                </>
              ) : (
                <><HiPlay /> Run & Submit</>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="glass p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  {results.status === 'passed' ? <HiCheckCircle className="text-emerald-400" /> : <HiXCircle className="text-red-400" />}
                  {results.status === 'passed' ? 'All Tests Passed!' : results.status === 'timeout' ? 'Time Limit Exceeded' : 'Tests Failed'}
                </h3>
                <span className="text-xs text-slate-500">{results.passedCount}/{results.totalTests} passed</span>
              </div>

              {results.xpEarned > 0 && (
                <div className="mb-3 p-2 rounded-lg text-center" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <span className="text-sm text-amber-300 font-medium">🎉 +{results.xpEarned} XP earned!</span>
                </div>
              )}

              <div className="space-y-2">
                {results.results?.map((r, i) => (
                  <div key={i} className="p-2 rounded-lg flex items-start gap-2" style={{
                    background: r.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${r.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                  }}>
                    <span className="text-sm mt-0.5">{r.passed ? '✅' : '❌'}</span>
                    <div className="text-xs flex-1">
                      <span className="text-slate-400">Test {r.testCase}:</span>
                      {r.output !== '[Hidden]' && (
                        <>
                          <span className="text-slate-500 ml-2">Output: </span>
                          <span className={r.passed ? 'text-emerald-400' : 'text-red-400'}>{r.output || '(empty)'}</span>
                          {!r.passed && <><span className="text-slate-500 ml-2">Expected: </span><span className="text-slate-300">{r.expected}</span></>}
                        </>
                      )}
                      {r.error && <p className="text-red-400 mt-1">{r.error}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {results.executionTime && (
                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1"><HiClock /> {results.executionTime}ms</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingProblem;
