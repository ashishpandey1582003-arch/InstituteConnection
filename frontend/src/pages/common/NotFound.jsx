import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 mb-6">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-350">Page Not Found</p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 max-w-sm">
        The destination you are trying to visit might have been removed, renamed, or is temporarily offline.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600"
      >
        Return to Portal
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default NotFound;
