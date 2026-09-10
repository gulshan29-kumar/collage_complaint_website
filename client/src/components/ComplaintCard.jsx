import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
            <Tag className="w-3 h-3 mr-1" />
            {complaint.category}
          </span>
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-1 hover:text-sky-600 transition-colors">
          <Link to={`/complaints/${complaint._id}`}>{complaint.title}</Link>
        </h3>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {complaint.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{complaint.location}</span>
          </span>
          <span className="hidden sm:flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        <Link
          to={`/complaints/${complaint._id}`}
          className="inline-flex items-center font-semibold text-sky-600 hover:text-sky-700"
        >
          View
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
