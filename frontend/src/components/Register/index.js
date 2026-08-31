import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.RENDER_APP_BACKEND_URL || "http://localhost:5000"}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => window.location.href = '/login', 1500);
      } else {
        setError(data.error || data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-bold text-indigo-400 tracking-tight hover:text-indigo-300 transition-colors">
            SyncCanvas
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            Create your free workspace
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            Create an account
          </h2>

          {/* Error / Success Banners */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-950/30 border border-rose-900 text-rose-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-950/30 border border-emerald-900 text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-6 text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
