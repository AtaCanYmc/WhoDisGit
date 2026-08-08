import React from 'react';
import GithubDashboard from './components/GithubDashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-cyan-500 selection:text-slate-950">
      <GithubDashboard />
    </div>
  );
};

export default App;
