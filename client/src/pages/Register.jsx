import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wrench, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
            Create Student Account
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Sign up to report and track campus maintenance issues.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-start space-x-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Verma"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              College Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@college.edu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
