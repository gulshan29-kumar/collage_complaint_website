import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getComplaints } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electrical',
  'Internet/Wi-Fi',
  'Plumbing',
  'Cleaning',
  'Hostel',
  'Classroom',
  'Furniture',
  'Other',
];

const STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        getAdminStats(),
        getComplaints(),
      ]);
      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter complaints based on Search, Status, Category, Priority (Section 16)
  const filteredComplaints = complaints.filter((c) => {
    const titleMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const studentMatch = c.student?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSearch = searchQuery === '' || titleMatch || studentMatch;

    const matchesStatus =
      selectedStatus === 'All' || c.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    const matchesPriority =
      selectedPriority === 'All' || c.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Oversee all campus complaints, assign staff, and update grievance statuses.
          </p>
        </div>
        <div>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Top 4 Stats Cards (Section 15) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Complaints
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {stats ? stats.totalComplaints : complaints.length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending Review
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {stats
                ? stats.pending
                : complaints.filter((c) => c.status === 'Pending').length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              In Progress / Assigned
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {stats
                ? (stats.inProgress || 0) + (stats.assigned || 0)
                : complaints.filter(
                    (c) => c.status === 'In Progress' || c.status === 'Assigned'
                  ).length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Resolved Issues
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {stats
                ? stats.resolved
                : complaints.filter((c) => c.status === 'Resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar Section (Section 16) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaints or student..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Statuses</option>
              {STATUSES.filter((s) => s !== 'All').map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.filter((p) => p !== 'All').map((pri) => (
                <option key={pri} value={pri}>
                  Priority: {pri}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button if any active */}
        {(searchQuery ||
          selectedStatus !== 'All' ||
          selectedCategory !== 'All' ||
          selectedPriority !== 'All') && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
            <span>
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedCategory('All');
                setSelectedPriority('All');
              }}
              className="text-sky-600 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Complaints Table (Section 15) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">All Campus Complaints</h2>
          <span className="text-xs text-slate-500">
            {filteredComplaints.length} items
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading complaints table...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No complaints found matching current search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        <span className="truncate max-w-[180px]">{c.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <div className="font-medium">{c.student?.name || 'Student'}</div>
                      <div className="text-xs text-slate-400">{c.student?.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {c.category}
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

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-sky-200 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition"
                      >
                        Manage
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
