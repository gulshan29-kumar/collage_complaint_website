import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints, deleteComplaint } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Trash2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCancelComplaint = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel complaint: "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel complaint.');
    } finally {
      setDeletingId(null);
    }
  };

  // Compute stat cards
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your campus maintenance requests and report new issues.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchComplaints}
            className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/create-complaint"
            className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Complaint
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Complaints
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{pendingCount}</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              In Progress
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{inProgressCount}</div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center space-x-4">
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

      {/* Complaints List Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">My Recent Complaints</h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {complaints.length} records
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading complaints...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          /* Empty State (Section 27) */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No complaints yet.</h3>
            <p className="text-sm text-slate-600 mt-1.5 mb-6">
              Create your first complaint and track its progress here.
            </p>
            <Link
              to="/create-complaint"
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Complaint
            </Link>
          </div>
        ) : (
          /* Table for Desktop & Cards for Mobile */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          to={`/complaints/${c._id}`}
                          className="font-medium text-slate-900 hover:text-sky-600 line-clamp-1"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {c.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{c.location}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link
                          to={`/complaints/${c._id}`}
                          className="text-sky-600 hover:text-sky-900 font-semibold"
                        >
                          View
                        </Link>
                        {/* Student Cancellation: Only Pending (Section 14) */}
                        {c.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelComplaint(c._id, c.title)}
                            disabled={deletingId === c._id}
                            className="text-red-500 hover:text-red-700 inline-flex items-center text-xs font-semibold transition"
                            title="Cancel complaint"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            {deletingId === c._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List */}
            <div className="md:hidden divide-y divide-slate-100">
              {complaints.map((c) => (
                <div key={c._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {c.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>

                  <Link
                    to={`/complaints/${c._id}`}
                    className="block font-semibold text-slate-900 hover:text-sky-600 text-base"
                  >
                    {c.title}
                  </Link>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {c.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/complaints/${c._id}`}
                      className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>

                    {c.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelComplaint(c._id, c.title)}
                        disabled={deletingId === c._id}
                        className="text-red-500 hover:text-red-700 inline-flex items-center text-xs font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        {deletingId === c._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
