import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="card">
      <span className="badge">React + Vite</span>
      <h1>Hello, React!</h1>
      <p>Your test-aws project is ready. Start building something great.</p>
      <button onClick={() => setCount((current) => current + 1)}>
        Count: {count}
      </button>
      <p className="hint">Edit <code>src/App.jsx</code> to get started.</p>
    </main>
  );
}
