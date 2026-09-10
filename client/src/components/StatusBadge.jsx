import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusStyle = (val) => {
    switch (val) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${getStatusStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = (val) => {
    switch (val) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityStyle(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

export default StatusBadge;
