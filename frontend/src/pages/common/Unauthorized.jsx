import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-150 text-red-650 dark:bg-red-950/50 dark:text-red-400 mb-6">
        <ShieldAlert className="h-8 w-8 animate-bounce" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white font-mono">403</h1>
      <p className="mt-2 text-lg font-semibold text-slate-650 dark:text-slate-350">Access Denied</p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 max-w-sm">
        You do not possess the required credentials to access this administrative segment.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600"
      >
        Go back to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default Unauthorized;
