import React, { useState, useEffect } from 'react';
import api from '../../hooks/useAxios';
import { Activity, Clock } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/api/admin/logs');
        if (response.data.success) {
          setLogs(response.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-sans">Administrative Audit Trails</h1>
        <p className="text-xs text-slate-550">Historical audit logs of coordinator activities and updates</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-250 rounded-3xl dark:border-slate-800">
          <Activity className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-xs text-slate-400">No activity logs recorded yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-205 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <div key={log._id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/20 flex gap-4 items-start text-xs">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-655 dark:bg-slate-800 dark:text-slate-350 shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-bold text-slate-800 dark:text-white">
                      {log.action.split('_').join(' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-[11px]">
                    {log.details}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Coordinator: {log.admin?.name || 'System'} ({log.admin?.email})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
