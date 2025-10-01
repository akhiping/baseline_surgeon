import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { EXAMPLES, type Example } from './examples';
import { transformCode, type BaselineTarget } from './transform-engine';
import './App.css';

export default function App() {
  const [selectedExample, setSelectedExample] = useState<Example>(EXAMPLES[0]);
  const [beforeCode, setBeforeCode] = useState<string>(EXAMPLES[0].code);
  const [afterCode, setAfterCode] = useState<string>('');
  const [target, setTarget] = useState<BaselineTarget>('baseline-now');
  const [isTransforming, setIsTransforming] = useState(false);
  const [explanations, setExplanations] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleExampleChange = (exampleId: string) => {
    const example = EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setSelectedExample(example);
      setBeforeCode(example.code);
      setAfterCode('');
      setExplanations([]);
      setError('');
    }
  };

  const handleTransform = async () => {
    setIsTransforming(true);
    setError('');
    
    try {
      const result = await transformCode(
        beforeCode,
        selectedExample.language,
        target
      );
      
      setAfterCode(result.code);
      setExplanations(result.explanations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transform failed');
      setAfterCode('');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopyDiff = () => {
    const diff = `// BEFORE:\n${beforeCode}\n\n// AFTER:\n${afterCode}`;
    navigator.clipboard.writeText(diff);
    alert('Diff copied to clipboard!');
  };

  const handleReset = () => {
    setBeforeCode(selectedExample.code);
    setAfterCode('');
    setExplanations([]);
    setError('');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏥 Baseline Surgeon Playground</h1>
          <p>Interactive demo of automatic Baseline-safe transforms</p>
        </div>
      </header>

      <div className="toolbar">
        <div className="toolbar-section">
          <label>
            Example:
            <select 
              value={selectedExample.id} 
              onChange={(e) => handleExampleChange(e.target.value)}
            >
              <optgroup label="JavaScript">
                {EXAMPLES.filter(ex => ex.language === 'javascript').map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </optgroup>
              <optgroup label="CSS">
                {EXAMPLES.filter(ex => ex.language === 'css').map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </optgroup>
            </select>
          </label>

          <label>
            Target:
            <select value={target} onChange={(e) => setTarget(e.target.value as BaselineTarget)}>
              <option value="baseline-now">Baseline Now (2025)</option>
              <option value="baseline-2024">Baseline 2024</option>
              <option value="baseline-2025">Baseline 2025</option>
            </select>
          </label>
        </div>

        <div className="toolbar-section">
          <button 
            onClick={handleTransform} 
            disabled={isTransforming}
            className="btn btn-primary"
          >
            {isTransforming ? '⏳ Transforming...' : '▶️ Run Transform'}
          </button>
          <button onClick={handleReset} className="btn">🔄 Reset</button>
          {afterCode && (
            <button onClick={handleCopyDiff} className="btn">📋 Copy Diff</button>
          )}
        </div>
      </div>

      <div className="description-panel">
        <strong>{selectedExample.title}</strong>
        <span>{selectedExample.description}</span>
      </div>

      <div className="editor-container">
        <div className="editor-pane">
          <div className="pane-header">Before (Original)</div>
          <Editor
            height="100%"
            language={selectedExample.language}
            value={beforeCode}
            onChange={(value) => setBeforeCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="editor-pane">
          <div className="pane-header">
            After (Transformed)
            {afterCode && <span className="badge">✓ Transformed</span>}
          </div>
          <Editor
            height="100%"
            language={selectedExample.language}
            value={afterCode || '// Click "Run Transform" to see the result'}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              readOnly: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-panel">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {explanations.length > 0 && (
        <div className="explanation-panel">
          <h3>📖 What Changed & Why</h3>
          <ul>
            {explanations.map((explanation, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: explanation }} />
            ))}
          </ul>
        </div>
      )}

      <footer className="footer">
        <p>
          Built for the <a href="https://baseline.hackathon.com" target="_blank" rel="noopener noreferrer">Baseline Tooling Hackathon</a>
          {' • '}
          <a href="https://github.com/baseline-surgeon/baseline-surgeon" target="_blank" rel="noopener noreferrer">View on GitHub</a>
          {' • '}
          <a href="/docs/TRANSFORMS.md" target="_blank" rel="noopener noreferrer">Documentation</a>
        </p>
      </footer>
    </div>
  );
} 