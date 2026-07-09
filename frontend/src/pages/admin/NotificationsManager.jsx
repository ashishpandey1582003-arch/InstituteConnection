import React, { useState, useEffect } from 'react';
import api from '../../hooks/useAxios';
import { Bell, Send, CheckCircle, ShieldAlert } from 'lucide-react';

const NotificationsManager = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('All'); // 'All', 'Branch-wise', 'Year-wise'
  const [targetBranches, setTargetBranches] = useState([]);
  const [targetYears, setTargetYears] = useState([]);

  // Log list
  const [notices, setNotices] = useState([]);
  const [fetchingNotices, setFetchingNotices] = useState(true);

  const branchesList = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'MCA', 'MBA', 'AI/ML'];
  const yearsList = [1, 2, 3, 4];

  const fetchNotices = async () => {
    setFetchingNotices(true);
    try {
      const response = await api.get('/api/notifications');
      if (response.data.success) {
        setNotices(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleBranchChange = (branch) => {
    if (targetBranches.includes(branch)) {
      setTargetBranches((prev) => prev.filter((b) => b !== branch));
    } else {
      setTargetBranches((prev) => [...prev, branch]);
    }
  };

  const handleYearChange = (year) => {
    if (targetYears.includes(year)) {
      setTargetYears((prev) => prev.filter((y) => y !== year));
    } else {
      setTargetYears((prev) => [...prev, year]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg(null);

    const data = {
      title,
      message,
      type,
      targetBranches: type === 'Branch-wise' ? targetBranches : [],
      targetYears: type === 'Year-wise' ? targetYears : [],
    };

    try {
      const response = await api.post('/api/notifications', data);
      if (response.data.success) {
        setSuccess(true);
        setTitle('');
        setMessage('');
        setType('All');
        setTargetBranches([]);
        setTargetYears([]);
        fetchNotices(); // Reload notices
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to broadcast notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Broadcast Form (Left Side) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Bell className="h-5 w-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Broadcast Alert</h3>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span>Broadcast dispatched successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-750 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
              <ShieldAlert className="h-5 w-5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Notification Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule Change: Google Drive"
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-xs dark:border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Announcement details</label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details about date, venue, syllabus, or results..."
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-xs dark:border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Target Audience</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-xs dark:border-slate-800 text-slate-655 focus:outline-none"
              >
                <option value="All">All Registered Students</option>
                <option value="Branch-wise">Branch-wise Selection</option>
                <option value="Year-wise">Year-wise Selection</option>
              </select>
            </div>

            {/* Branch checkboxes */}
            {type === 'Branch-wise' && (
              <div className="space-y-2 border border-slate-100 p-3 rounded-xl dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Select Target Branches</label>
                <div className="grid grid-cols-2 gap-2">
                  {branchesList.map((branch) => (
                    <label key={branch} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={targetBranches.includes(branch)}
                        onChange={() => handleBranchChange(branch)}
                        className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                      />
                      {branch}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Year checkboxes */}
            {type === 'Year-wise' && (
              <div className="space-y-2 border border-slate-100 p-3 rounded-xl dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-405 uppercase">Select Target Years</label>
                <div className="flex gap-4">
                  {yearsList.map((year) => (
                    <label key={year} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={targetYears.includes(year)}
                        onChange={() => handleYearChange(year)}
                        className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                      />
                      {year} Yr
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4.5 w-4.5" />
              {loading ? 'Dispatched...' : 'Broadcast'}
            </button>
          </form>
        </div>
      </div>

      {/* Broadcast History (Right Side) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
            Broadcast History
          </h3>

          {fetchingNotices ? (
            <div className="h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ) : notices.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No alerts broadcasted yet.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {notices.map((note) => (
                <div
                  key={note._id}
                  className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 dark:border-slate-850 dark:hover:border-slate-800 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {note.title}
                    </h4>
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-[8px] font-bold text-brand-700 dark:bg-brand-950/20 dark:text-brand-400">
                      {note.type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    {note.message}
                  </p>

                  <div className="mt-4 border-t border-slate-50 pt-2 flex items-center justify-between text-[9px] text-slate-400 dark:border-slate-850 dark:text-slate-500">
                    <span>Sender: {note.sender?.name || 'System'}</span>
                    <span>Date: {new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsManager;
