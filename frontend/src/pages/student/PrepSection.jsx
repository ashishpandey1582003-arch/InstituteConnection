import React, { useState, useEffect } from 'react';
import api from '../../hooks/useAxios';
import { BookOpen, HelpCircle, Code, BrainCircuit, UserCheck, Link2, Building2 } from 'lucide-react';

const PrepSection = () => {
  const [loading, setLoading] = useState(true);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [activeTab, setActiveTab] = useState('pattern'); // 'pattern', 'technical', 'coding', 'aptitude', 'hr', 'resources'

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await api.get('/api/recruiters');
        if (response.data.success) {
          setRecruiters(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedRecruiter(response.data.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load preparation guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const handleSelectCompany = (id) => {
    const found = recruiters.find((r) => r._id === id);
    if (found) setSelectedRecruiter(found);
  };

  if (loading) {
    return (
      <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
    );
  }

  if (recruiters.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No placement drives found</h3>
        <p className="text-xs text-slate-400 mt-1">Preparation material will be published when drives are created.</p>
      </div>
    );
  }

  const prep = selectedRecruiter?.prepMaterial || {};

  const tabs = [
    { id: 'pattern', name: 'Interview Pattern', icon: BookOpen },
    { id: 'technical', name: 'Prev Questions', icon: HelpCircle },
    { id: 'coding', name: 'Coding Questions', icon: Code },
    { id: 'aptitude', name: 'Aptitude Prep', icon: BrainCircuit },
    { id: 'hr', name: 'HR Questions', icon: UserCheck },
    { id: 'resources', name: 'Resources', icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-sans">Interview Preparation Hub</h1>
        <p className="text-xs text-slate-500">Practice questions, read patterns, and find resources per recruiter drive</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left Side: Company Selector List */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 px-2">Recruiters</h4>
          {recruiters.map((company) => (
            <button
              key={company._id}
              onClick={() => handleSelectCompany(company._id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                selectedRecruiter?._id === company._id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Building2 className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate text-left">{company.companyName}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Tabbed prep details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {selectedRecruiter?.companyName} Interview Guide
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500">
                  Target Role: {selectedRecruiter?.jobRole} ({selectedRecruiter?.packageCTC} LPA)
                </p>
              </div>
            </div>

            {/* Preparation Tabs bar */}
            <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-50 text-brand-650 dark:bg-brand-950/20 dark:text-brand-350'
                      : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
              {/* Pattern */}
              {activeTab === 'pattern' && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                      Recruitment Process Overview
                    </h5>
                    <p className="mt-2 text-xs leading-relaxed text-slate-650 dark:text-slate-355 whitespace-pre-line bg-slate-50 dark:bg-slate-850 p-4 rounded-xl">
                      {selectedRecruiter?.selectionProcess || 'No details provided.'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                      Preparation Tips
                    </h5>
                    <p className="mt-2 text-xs leading-relaxed text-slate-650 dark:text-slate-355 bg-slate-50 dark:bg-slate-855 p-4 rounded-xl">
                      {prep.interviewPrep || 'No guidelines currently published.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Technical Questions */}
              {activeTab === 'technical' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase">Previous Questions</h5>
                  {prep.prevQuestions?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">No technical questions available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {prep.prevQuestions?.map((q, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-850 dark:text-slate-300"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-350">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5 leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Coding Questions */}
              {activeTab === 'coding' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase">Recommended Coding Challenges</h5>
                  {prep.codingQuestions?.length === 0 ? (
                    <p className="text-xs text-slate-405 py-4">No coding questions listed.</p>
                  ) : (
                    <ul className="space-y-2">
                      {prep.codingQuestions?.map((q, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border border-slate-100 p-3 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300"
                        >
                          <Code className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Aptitude Topics */}
              {activeTab === 'aptitude' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase">Critical Aptitude Topics</h5>
                  {prep.aptitudeTopics?.length === 0 ? (
                    <p className="text-xs text-slate-405 py-4">No topics listed.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {prep.aptitudeTopics?.map((topic, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-750 dark:border-slate-800 dark:text-slate-300 font-semibold"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HR Questions */}
              {activeTab === 'hr' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase">Common HR Questions</h5>
                  {prep.hrQuestions?.length === 0 ? (
                    <p className="text-xs text-slate-405 py-4">No questions listed.</p>
                  ) : (
                    <ul className="space-y-2">
                      {prep.hrQuestions?.map((q, idx) => (
                        <li
                          key={idx}
                          className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-slate-850 dark:text-slate-305"
                        >
                          <p className="font-bold text-slate-850 dark:text-white">Q: {q}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Resources */}
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase">Recommended Web Resources</h5>
                  {prep.resources?.length === 0 ? (
                    <p className="text-xs text-slate-405 py-4">No resources listed.</p>
                  ) : (
                    <ul className="space-y-2">
                      {prep.resources?.map((r, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-xs text-brand-600 hover:text-brand-750 dark:border-slate-800"
                        >
                          <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="font-bold cursor-pointer">{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepSection;
