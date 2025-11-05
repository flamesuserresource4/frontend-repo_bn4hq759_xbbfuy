import React, { useMemo, useState } from 'react';
import HeroSection from './components/HeroSection';
import CategoryTable from './components/CategoryTable';
import Collapsible from './components/Collapsible';
import ReportActions from './components/ReportActions';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const severityIcon = (sev) => {
  if (sev === 'good') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (sev === 'medium') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-rose-600" />;
};

function computeMockResults(url) {
  const hash = Array.from(url).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = (seed, min = 40, max = 98) => min + ((seed * 13) % (max - min));

  const scores = {
    SEO: Math.round(rand(hash + 1, 55, 98)),
    Performance: Math.round(rand(hash + 2, 45, 95)),
    Accessibility: Math.round(rand(hash + 3, 50, 99)),
    'Best Practices': Math.round(rand(hash + 4, 50, 98)),
    Security: Math.round(rand(hash + 5, 60, 100)),
    PWA: Math.round(rand(hash + 6, 30, 95)),
  };

  const categoryRows = [
    { category: 'Desktop Performance', score: scores.Performance, comments: 'Simulated from resource sizes and render-blocking hints.' },
    { category: 'Mobile Performance', score: Math.max(30, scores.Performance - 8), comments: 'Simulated mobile constraints applied.' },
    { category: 'Accessibility', score: scores.Accessibility, comments: 'Contrast, labels, ARIA roles sampled locally.' },
    { category: 'Best Practices', score: scores['Best Practices'], comments: 'Front-end anti-patterns and deprecated APIs.' },
    { category: 'SEO', score: scores.SEO, comments: 'Titles, meta, headings, links, structured data.' },
    { category: 'Security', score: scores.Security, comments: 'HTTPS, mixed content, and headers.' },
    { category: 'PWA', score: scores.PWA, comments: 'Manifest, service worker, offline hints.' },
  ];

  const weighted = Math.round(
    scores.SEO * 0.3 + scores.Performance * 0.3 + scores.Accessibility * 0.2 + scores.Security * 0.1 + scores.PWA * 0.1
  );

  const vitals = [
    { label: 'LCP', value: (2000 + (hash % 1200)) / 1000 + 's', severity: scores.Performance > 80 ? 'good' : scores.Performance > 60 ? 'medium' : 'bad', details: 'Estimated from largest image/element size.' },
    { label: 'FCP', value: (900 + (hash % 600)) / 1000 + 's', severity: scores.Performance > 75 ? 'good' : scores.Performance > 55 ? 'medium' : 'bad', details: 'Simulated based on CSS/JS blocking count.' },
    { label: 'CLS', value: ((hash % 15) / 100).toFixed(2), severity: scores.Performance > 85 ? 'good' : scores.Performance > 65 ? 'medium' : 'bad', details: 'Heuristic based on images without dimensions.' },
    { label: 'TTI', value: (2600 + (hash % 1600)) / 1000 + 's', severity: scores.Performance > 80 ? 'good' : scores.Performance > 60 ? 'medium' : 'bad', details: 'Estimated from JS size and long tasks.' },
    { label: 'FID', value: (10 + (hash % 60)) + 'ms', severity: scores.Performance > 80 ? 'good' : scores.Performance > 60 ? 'medium' : 'bad', details: 'Derived from input readiness heuristics.' },
    { label: 'TBT', value: (50 + (hash % 350)) + 'ms', severity: scores.Performance > 80 ? 'good' : scores.Performance > 60 ? 'medium' : 'bad', details: 'Total blocking from long tasks proxy.' },
  ];

  const issues = {
    seo: [
      { severity: scores.SEO >= 80 ? 'good' : 'medium', text: 'Title length within recommended range.' },
      { severity: scores.SEO < 70 ? 'bad' : 'medium', text: 'Missing or short meta description on some pages.', link: '/meta' },
      { severity: 'medium', text: 'Multiple H1 tags detected on selected templates.', link: '/templates' },
      { severity: 'good', text: 'Canonical tag present.' },
    ],
    accessibility: [
      { severity: 'bad', text: 'Images without alt attributes found (e.g., /assets/logo.png).', link: '/assets/logo.png' },
      { severity: 'medium', text: 'Form inputs missing associated labels in contact form.', link: '/contact' },
      { severity: 'good', text: 'Landmark roles present and correctly structured.' },
    ],
    resources: [
      { severity: 'medium', text: 'Render-blocking CSS detected (2 files).', link: '/styles/main.css' },
      { severity: 'medium', text: 'Large image could be compressed (hero.jpg ~1.8MB).', link: '/images/hero.jpg' },
      { severity: 'good', text: 'HTTP caching headers set for static assets.' },
    ],
  };

  return { url, scores, categoryRows, weighted, vitals, issues };
}

export default function App() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onAnalyze = async (url) => {
    setTarget(url);
    setLoading(true);
    // In this sandbox iteration we present a client-side demo result
    await new Promise((r) => setTimeout(r, 700));
    setResult(computeMockResults(url));
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setTarget('');
    setLoading(false);
  };

  const gauge = useMemo(() => {
    const score = result?.weighted ?? 0;
    const deg = (score / 100) * 360;
    return { score, style: { background: `conic-gradient(#4f46e5 ${deg}deg, #e5e7eb ${deg}deg 360deg)` } };
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection onAnalyze={onAnalyze} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {loading && (
          <div className="mx-auto mt-8 w-full rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-700 shadow-sm">
            Analyzing {target} …
          </div>
        )}

        {result && !loading && (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0">
                  <div className="absolute inset-0 rounded-full" style={gauge.style} />
                  <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{gauge.score}</div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">Summary</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Audit target</div>
                  <a href={result.url} target="_blank" rel="noreferrer" className="break-all text-lg font-semibold text-slate-900 hover:underline">
                    {result.url}
                  </a>
                  <p className="mt-1 text-sm text-slate-600">Weighted by SEO 30%, Performance 30%, Accessibility 20%, Security 10%, PWA 10%.</p>
                </div>
              </div>
              <ReportActions onReset={reset} />
            </div>

            <CategoryTable data={result.categoryRows} />

            <div className="grid gap-6 md:grid-cols-2">
              <Collapsible title="Core Web Vitals" subtitle="Estimated locally from heuristic metrics" defaultOpen>
                <ul className="space-y-2">
                  {result.vitals.map((v) => (
                    <li key={v.label} className="flex items-start gap-2">
                      {severityIcon(v.severity)}
                      <div className="text-sm text-slate-800">
                        <span className="font-medium">{v.label}:</span> {v.value}
                        <div className="text-xs text-slate-600">{v.details}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapsible>

              <Collapsible title="SEO Checks" subtitle="Metadata, headings, structured data">
                <ul className="space-y-2">
                  {result.issues.seo.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {severityIcon(it.severity)}
                      <div className="text-sm text-slate-800">
                        {it.text}
                        {it.link && (
                          <span className="ml-1 text-xs text-slate-600">(e.g., {it.link})</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapsible>

              <Collapsible title="Accessibility Issues" subtitle="Contrast, labels, ARIA roles">
                <ul className="space-y-2">
                  {result.issues.accessibility.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {severityIcon(it.severity)}
                      <div className="text-sm text-slate-800">
                        {it.text}
                        {it.link && <span className="ml-1 text-xs text-slate-600">(e.g., {it.link})</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapsible>

              <Collapsible title="Resource Optimization" subtitle="Images, JavaScript, CSS">
                <ul className="space-y-2">
                  {result.issues.resources.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {severityIcon(it.severity)}
                      <div className="text-sm text-slate-800">
                        {it.text}
                        {it.link && <span className="ml-1 text-xs text-slate-600">(e.g., {it.link})</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapsible>
            </div>
          </div>
        )}
      </main>

      {!result && !loading && (
        <div className="mx-auto max-w-3xl px-4 pb-16 text-center text-slate-600">
          Enter a website URL to begin an audit. This preview shows the interface; backend analysis will integrate next.
        </div>
      )}
    </div>
  );
}
