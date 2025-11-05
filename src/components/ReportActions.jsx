import React from 'react';
import { Download } from 'lucide-react';

const ReportActions = ({ onReset }) => {
  const handleDownload = () => {
    // Simple, reliable export path for now
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
      >
        <Download className="h-4 w-4" />
        Download PDF Report
      </button>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        Start New Audit
      </button>
    </div>
  );
};

export default ReportActions;
