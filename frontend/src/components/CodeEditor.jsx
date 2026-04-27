import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language = 'javascript', readOnly = false, height = '400px' }) => {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99, 102, 241, 0.15)' }}>
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={(val) => onChange(val || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full" style={{ background: '#1e1e1e' }}>
            <div className="w-8 h-8 rounded-full animate-spin" style={{
              borderWidth: '2px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent',
            }} />
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
