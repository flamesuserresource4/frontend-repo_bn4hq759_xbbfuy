import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const statusBadge = (score) => {
  if (score >= 80) return { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, label: 'Good', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (score >= 60) return { icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, label: 'Needs Attention', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { icon: <XCircle className="h-4 w-4 text-rose-600" />, label: 'Poor', color: 'bg-rose-50 text-rose-700 border-rose-200' };
};

const CategoryTable = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Score</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => {
            const b = statusBadge(row.score);
            return (
              <tr key={row.category} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{row.category}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${b.color}`}>
                    {b.icon}
                    {b.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold tabular-nums text-slate-900">{row.score}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.comments}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
