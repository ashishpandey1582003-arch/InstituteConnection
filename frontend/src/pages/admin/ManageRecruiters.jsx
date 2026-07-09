import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../hooks/useAxios';
import { Plus, Search, Trash2, Edit3, Eye, Calendar, DollarSign, Briefcase } from 'lucide-react';

const ManageRecruiters = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/recruiters');
      if (response.data.success) {
        setDrives(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the drive for ${name}?`)) {
      return;
    }
    try {
      const response = await api.delete(`/api/recruiters/${id}`);
      if (response.data.success) {
        setDrives((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete recruitment drive.');
    }
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.jobRole.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || drive.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Corporate Drives</h1>
          <p className="text-xs text-slate-500">Configure corporate recruiter parameters, download pdfs, and inspect applicants</p>
        </div>
        <Link
          to="/admin/recruiter/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 shadow-md shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Recruiter Drive
        </Link>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search company or job role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-transparent py-2 pl-10 pr-4 text-xs dark:border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filter select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs dark:border-slate-800 text-slate-600 dark:text-slate-350 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Registration Open">Registration Open</option>
          <option value="Closed">Closed</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Recruiter List / Table */}
      {filteredDrives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <Briefcase className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-650 dark:text-slate-300">No recruitment drives configured yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4">Package (CTC)</th>
                  <th className="px-6 py-4">Drive Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDrives.map((drive) => (
                  <tr key={drive._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 text-slate-655 dark:text-slate-350">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {drive.companyName}
                    </td>
                    <td className="px-6 py-4 font-medium">{drive.jobRole}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {drive.packageCTC} LPA
                    </td>
                    <td className="px-6 py-4">
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        drive.status === 'Registration Open'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : drive.status === 'Upcoming'
                          ? 'bg-blue-50 text-blue-750 dark:bg-blue-950/20 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350'
                      }`}>
                        {drive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/applications/${drive._id}`}
                        className="inline-flex rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-brand-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-900 transition-colors"
                        title="View applicants"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/recruiter/edit/${drive._id}`}
                        className="inline-flex rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(drive._id, drive.companyName)}
                        className="inline-flex rounded-lg bg-slate-100 p-2 text-red-650 hover:bg-red-600 hover:text-white dark:bg-slate-800 dark:hover:bg-red-950/60 transition-colors"
                        title="Delete Recruiter"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecruiters;
