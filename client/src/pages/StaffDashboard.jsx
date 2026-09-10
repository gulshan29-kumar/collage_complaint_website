import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStaffComplaints } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssigned = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getStaffComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assigned tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const totalAssigned = complaints.length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Staff Work Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review your assigned maintenance tickets, update status, and post resolution notes.
          </p>
        </div>
        <div>
          <button
            onClick={fetchAssigned}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 3 Top Cards (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Assigned Complaints
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{totalAssigned}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              In Progress
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Resolved
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* Assigned Complaints List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Assigned Maintenance Tasks</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading assigned tasks...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No complaints currently assigned to you. Excellent work!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="p-6 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                      {c.category}
                    </span>
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    <Link to={`/complaints/${c._id}`} className="hover:text-sky-600">
                      {c.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {c.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Assigned: {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Link
                    to={`/complaints/${c._id}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition"
                  >
                    Action & Resolve
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
