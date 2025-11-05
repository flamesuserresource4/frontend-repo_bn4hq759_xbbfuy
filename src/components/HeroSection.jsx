import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Shield } from 'lucide-react';

function sanitizeUrl(input) {
  try {
    const trimmed = input.trim();
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  } catch {
    return '';
  }
}

const HeroSection = ({ onAnalyze }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const safe = sanitizeUrl(url);
    try {
      const parsed = new URL(safe);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setError('Please enter a valid http/https URL.');
        return;
      }
      onAnalyze(safe);
    } catch (err) {
      setError('Please enter a valid website URL (e.g., https://example.com).');
    }
  };

  return (
    <section className="relative w-full">
      <div className="h-[520px] w-full">
        <Spline
          scene="https://prod.spline.design/4HIlOdlXYYkZW66z/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-semibold tracking-tight">Web Audit Pro</h1>
          </div>
          <p className="mb-6 text-sm text-slate-700">
            Check a website’s SEO, performance, accessibility, best practices, security, and PWA readiness. All analysis is performed locally.
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-website.com"
              className="flex-1 rounded-lg border border-slate-300/80 bg-white px-4 py-3 text-slate-900 outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
              aria-label="Website URL"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Rocket className="h-5 w-5" />
              Check Website
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
