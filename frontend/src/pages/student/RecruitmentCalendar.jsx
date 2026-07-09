import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../hooks/useAxios';
import { Calendar, Building2, ChevronRight, Clock } from 'lucide-react';

const RecruitmentCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    const fetchCalendarDrives = async () => {
      try {
        const response = await api.get('/api/recruiters?sort=driveDate');
        if (response.data.success) {
          setDrives(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load drive schedules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarDrives();
  }, []);

  if (loading) {
    return (
      <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-sans">Recruitment Drive Calendar</h1>
        <p className="text-xs text-slate-550">Chronological calendar timeline for upcoming corporate drives</p>
      </div>

      {drives.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl dark:border-slate-800">
          <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">No upcoming drives listed</p>
        </div>
      ) : (
        <div className="relative max-w-2xl mx-auto border-l border-slate-200 dark:border-slate-800 pl-6 space-y-8">
          {drives.map((drive, idx) => {
            const driveDate = new Date(drive.driveDate);
            const isFuture = driveDate > new Date();

            return (
              <div key={drive._id} className="relative group">
                {/* Timeline node */}
                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-slate-200 group-hover:scale-125 transition-transform dark:border-slate-950 ${
                  isFuture ? 'bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-950/40' : 'bg-slate-300'
                }`}></span>

                {/* Date Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold ${isFuture ? 'text-brand-655' : 'text-slate-400'}`}>
                    {driveDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {!isFuture && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-slate-500 dark:bg-slate-800">
                      Completed
                    </span>
                  )}
                </div>

                {/* Details Box */}
                <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm hover:border-brand-350 dark:border-slate-850 dark:bg-slate-900 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 dark:bg-slate-850 dark:text-slate-300">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-brand-555 transition-colors">
                          {drive.companyName}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {drive.jobRole} | Package: {drive.packageCTC} LPA
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/student/recruiter/${drive._id}`}
                      className="rounded-lg bg-slate-50 p-2 text-slate-500 hover:bg-brand-500 hover:text-white dark:bg-slate-850 dark:hover:bg-brand-900 transition-colors"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-[9px] text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Registration Deadline: {new Date(drive.regEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruitmentCalendar;
