import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import apiClient from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/admin');
      } else {
        setError('No token received');
      }
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error || 'Login failed' : 'Login failed';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md p-8 panel border-brand/30 relative">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
          <span className="file-label text-xs">admin_auth.sh</span>
          <span className="text-xs font-mono text-emerald-400">● restricted</span>
        </div>

        <h2 className="font-display font-bold uppercase tracking-tight text-2xl mb-1 text-ink">
          Admin Portal
        </h2>
        <p className="text-xs text-mid mb-6 font-mono">
          Authenticate to manage projects, skills, site settings & messages.
        </p>

        {error && (
          <div className="text-xs font-mono p-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="file-label text-[10px] mb-1.5 block">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.dev"
              required
              className="field font-body"
            />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="field font-body"
            />
          </div>

          <button className="btn btn-brand justify-center w-full mt-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <span className="arrow">→</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-hairline text-center">
          <Link to="/" className="text-xs font-mono text-faint hover:text-brand transition-colors">
            ← Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
