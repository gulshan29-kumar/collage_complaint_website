import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createComplaint } from '../services/api';
import { ArrowLeft, AlertCircle, CheckCircle, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Electrical',
  'Internet/Wi-Fi',
  'Plumbing',
  'Cleaning',
  'Hostel',
  'Classroom',
  'Furniture',
  'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High'];

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'Medium',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a complaint title.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a complaint description.';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please specify the location (e.g. Hostel A, Room 102).';
    }
    if (!formData.priority) {
      newErrors.priority = 'Please select a priority.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await createComplaint(formData);
      setSuccessMessage('Complaint created successfully.');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Failed to submit complaint. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Maintenance Complaint
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Please fill out the form below with clear details so the maintenance team can resolve the issue quickly.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start space-x-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div>{serverError}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-start space-x-3 text-emerald-700 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Broken ceiling fan in Classroom 204"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                errors.title ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Category & Location in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                  errors.category ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.category}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Hostel B, Room 304 or Science Block Lab 1"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                  errors.location ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-center py-2.5 px-3 rounded-lg border cursor-pointer text-sm font-medium transition ${
                    formData.priority === p
                      ? 'bg-sky-50 border-sky-600 text-sky-700 font-semibold ring-1 ring-sky-600'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={formData.priority === p}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue clearly (what is broken, since when, any safety hazards)..."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                errors.description ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm disabled:opacity-50 transition"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
