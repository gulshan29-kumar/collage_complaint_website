import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wrench, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick-fill helper
  const handleQuickFill = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">CampusFix</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage campus problems easily.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-start space-x-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campusfix.com"
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
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-2">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('student@campusfix.com', 'Student@123')}
              className="px-2 py-1.5 border border-slate-200 rounded bg-slate-50 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition text-center font-medium"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('staff@campusfix.com', 'Staff@123')}
              className="px-2 py-1.5 border border-slate-200 rounded bg-slate-50 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition text-center font-medium"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@campusfix.com', 'Admin@123')}
              className="px-2 py-1.5 border border-slate-200 rounded bg-slate-50 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition text-center font-medium"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
