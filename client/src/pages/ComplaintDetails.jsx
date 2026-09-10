import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getComplaintById,
  deleteComplaint,
  getStaffList,
  assignStaff,
  updateAdminPriority,
  updateAdminStatus,
  updateStaffStatus,
  resolveComplaint,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Trash2,
  Send,
} from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin controls state
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [adminPriority, setAdminPriority] = useState('Medium');
  const [adminStatus, setAdminStatus] = useState('Pending');
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // Staff controls state
  const [staffResolutionNote, setStaffResolutionNote] = useState('');
  const [staffSubmitting, setStaffSubmitting] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getComplaintById(id);
      setComplaint(data);
      setSelectedStaffId(data.assignedTo?._id || '');
      setAdminNote(data.adminNote || '');
      setAdminPriority(data.priority || 'Medium');
      setAdminStatus(data.status || 'Pending');

      // If admin, load staff list
      if (user?.role === 'admin') {
        const staffRes = await getStaffList();
        setStaffList(staffRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, user?.role]);

  // Student cancellation
  const handleStudentCancel = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this complaint? This will permanently delete it.'
      )
    ) {
      return;
    }

    try {
      await deleteComplaint(id);
      alert('Complaint cancelled successfully.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel complaint.');
    }
  };

  // Admin actions
  const handleAdminAssignStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      alert('Please select a staff member to assign.');
      return;
    }
    setAdminSubmitting(true);
    try {
      const { data } = await assignStaff(id, {
        staffId: selectedStaffId,
        adminNote,
      });
      setComplaint(data);
      setAdminStatus(data.status);
      alert('Staff assigned successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign staff.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleAdminUpdatePriority = async (newPriority) => {
    try {
      await updateAdminPriority(id, { priority: newPriority });
      setComplaint((prev) => ({ ...prev, priority: newPriority }));
      setAdminPriority(newPriority);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority.');
    }
  };

  const handleAdminUpdateStatus = async (newStatus) => {
    try {
      const { data } = await updateAdminStatus(id, {
        status: newStatus,
        adminNote,
      });
      setComplaint(data);
      setAdminStatus(newStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Staff actions
  const handleStaffStartWork = async () => {
    setStaffSubmitting(true);
    try {
      const { data } = await updateStaffStatus(id, { status: 'In Progress' });
      setComplaint(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setStaffSubmitting(false);
    }
  };

  const handleStaffResolve = async (e) => {
    e.preventDefault();
    if (!staffResolutionNote.trim()) {
      alert('Please enter a resolution note describing the fix.');
      return;
    }
    setStaffSubmitting(true);
    try {
      const { data } = await resolveComplaint(id, {
        resolutionNote: staffResolutionNote,
      });
      setComplaint(data);
      setStaffResolutionNote('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve complaint.');
    } finally {
      setStaffSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium text-slate-500">Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h2 className="text-lg font-bold">Complaint Not Found</h2>
          <p className="text-sm mt-1">{error || 'This complaint does not exist or you do not have permission to view it.'}</p>
          <Link
            to="/"
            className="inline-flex items-center mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const backUrl =
    user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to={backUrl}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        {/* Student Cancel Option (Pending only - Section 14) */}
        {user?.role === 'student' && complaint.status === 'Pending' && (
          <button
            onClick={handleStudentCancel}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Cancel Complaint
          </button>
        )}
      </div>

      {/* Main Complaint Header & Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                <Tag className="w-3 h-3 mr-1" />
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {complaint.title}
            </h1>
          </div>
          <div>
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
              Location
            </span>
            <span className="font-semibold text-slate-800 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1 text-sky-600 flex-shrink-0" />
              {complaint.location}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
              Submitted By
            </span>
            <span className="font-semibold text-slate-800 flex items-center mt-1">
              <User className="w-4 h-4 mr-1 text-sky-600 flex-shrink-0" />
              {complaint.student?.name || 'Student'}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
              Assigned Staff
            </span>
            <span className="font-semibold text-slate-800 flex items-center mt-1">
              {complaint.assignedTo?.name ? (
                complaint.assignedTo.name
              ) : (
                <span className="text-slate-400 font-normal italic">Unassigned</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
              Reported Date
            </span>
            <span className="font-semibold text-slate-800 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1 text-sky-600 flex-shrink-0" />
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Description
          </h3>
          <p className="text-slate-700 whitespace-pre-line bg-white rounded-lg leading-relaxed text-sm">
            {complaint.description}
          </p>
        </div>

        {/* Admin note if present */}
        {complaint.adminNote && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Admin Note
            </h4>
            <p className="text-sm text-amber-900">{complaint.adminNote}</p>
          </div>
        )}

        {/* Resolution Note if resolved (Section 13, 19) */}
        {complaint.status === 'Resolved' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center text-emerald-800 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
              Resolution
            </div>
            <p className="text-sm text-emerald-900 bg-white/70 p-3.5 rounded-lg border border-emerald-100 font-medium leading-relaxed">
              {complaint.resolutionNote || 'The maintenance issue has been inspected and resolved.'}
            </p>
            {complaint.updatedAt && (
              <p className="text-xs text-emerald-700">
                Resolved on {new Date(complaint.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ADMIN CONTROL PANEL (Section 17) */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-sky-600" />
            Admin Complaint Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Assignment */}
            <form onSubmit={handleAdminAssignStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Assign Staff Member
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Choose Staff Member --</option>
                  {staffList.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} ({st.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Admin Internal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Instructions for staff or audit remarks..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {adminSubmitting ? 'Saving...' : 'Assign Staff & Save Note'}
              </button>
            </form>

            {/* Quick Status & Priority Toggles */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Change Priority
                </label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => handleAdminUpdatePriority(pri)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        complaint.priority === pri
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Change Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAdminUpdateStatus(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          complaint.status === st
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAFF CONTROL PANEL (Section 19) */}
      {user?.role === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-sky-600" />
            Staff Maintenance Action
          </h2>

          <div className="space-y-4">
            {complaint.status !== 'In Progress' && complaint.status !== 'Resolved' && (
              <div>
                <button
                  type="button"
                  onClick={handleStaffStartWork}
                  disabled={staffSubmitting}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark as "In Progress"
                </button>
              </div>
            )}

            {complaint.status !== 'Resolved' ? (
              <form onSubmit={handleStaffResolve} className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Add Resolution Note & Resolve <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={staffResolutionNote}
                    onChange={(e) => setStaffResolutionNote(e.target.value)}
                    placeholder="e.g. Wi-Fi router replaced and connection restored. Tested in 3 rooms."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={staffSubmitting}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm disabled:opacity-50 transition"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {staffSubmitting ? 'Resolving...' : 'Complete & Mark as Resolved'}
                </button>
              </form>
            ) : (
              <div className="text-sm font-semibold text-emerald-700 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                This complaint has been marked as Resolved.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
