
import React, { useState, useMemo } from 'react';
import { Announcement, UserRole, AnnouncementCategory } from '../types';

interface Props {
  announcements: Announcement[];
  role: UserRole;
  onAdd: (a: Omit<Announcement, 'id'>) => void;
}

const AnnouncementView: React.FC<Props> = ({ announcements, role, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'All' | AnnouncementCategory>('All');
  const [newA, setNewA] = useState({ 
    title: '', 
    content: '', 
    priority: 'Normal' as any,
    category: 'General' as AnnouncementCategory
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...newA, date: new Date().toISOString().split('T')[0], author: 'Officer' });
    setShowAdd(false);
    setNewA({ title: '', content: '', priority: 'Normal', category: 'General' });
  };

  const processedAnnouncements = useMemo(() => {
    // First, sort by date (Recent to Oldest)
    const sorted = [...announcements].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Then, apply category filter
    if (filter === 'All') return sorted;
    return sorted.filter(a => a.category === filter);
  }, [announcements, filter]);

  const categoryIcons: Record<AnnouncementCategory, string> = {
    'General': 'fa-circle-info',
    'Community Events': 'fa-calendar-check',
    'Sports & Wellness': 'fa-heart-pulse',
    'Volunteer & Participation': 'fa-handshake-angle'
  };

  const categoryColors: Record<AnnouncementCategory, string> = {
    'General': 'text-slate-500 bg-slate-100',
    'Community Events': 'text-blue-600 bg-blue-100',
    'Sports & Wellness': 'text-emerald-600 bg-emerald-100',
    'Volunteer & Participation': 'text-purple-600 bg-purple-100'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filtering Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {(['All', 'Community Events', 'Sports & Wellness', 'Volunteer & Participation', 'General'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {role === UserRole.OFFICER && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
          >
            <i className={`fa-solid ${showAdd ? 'fa-xmark' : 'fa-plus'}`}></i>
            {showAdd ? 'Cancel' : 'New Post'}
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-slate-50 pb-4">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Post New Announcement</h3>
            <p className="text-sm text-slate-500">Classification helps residents find information faster.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-semibold"
                value={newA.category}
                onChange={e => setNewA({...newA, category: e.target.value as any})}
              >
                <option value="General">General Notice</option>
                <option value="Community Events">Community Events / Meetings</option>
                <option value="Sports & Wellness">Sports & Wellness Programs</option>
                <option value="Volunteer & Participation">Volunteer Opportunities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority Level</label>
              <div className="flex gap-2">
                {['Low', 'Normal', 'High'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewA({...newA, priority: p as any})}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                      newA.priority === p 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Headline</label>
            <input 
              required
              placeholder="E.g. Summer Sports Fest 2024"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 font-medium" 
              value={newA.title}
              onChange={e => setNewA({...newA, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Details</label>
            <textarea 
              required
              rows={4}
              placeholder="Describe the activity, dates, and how to participate..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
              value={newA.content}
              onChange={e => setNewA({...newA, content: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-50">
            <button 
              type="button" 
              onClick={() => setShowAdd(false)}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {processedAnnouncements.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl text-slate-200">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <p className="text-slate-400 font-medium">No announcements found in this category.</p>
          </div>
        ) : (
          processedAnnouncements.map((a) => (
            <div key={a.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
              {/* Category accent bar */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                a.category === 'Sports & Wellness' ? 'bg-emerald-500' :
                a.category === 'Community Events' ? 'bg-blue-500' :
                a.category === 'Volunteer & Participation' ? 'bg-purple-500' : 'bg-slate-300'
              }`}></div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${categoryColors[a.category || 'General']}`}>
                    <i className={`fa-solid ${categoryIcons[a.category || 'General']}`}></i>
                    {a.category || 'General'}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    a.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 
                    'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {a.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-regular fa-calendar"></i>
                    {a.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-regular fa-user"></i>
                    {a.author}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">{a.title}</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base font-medium opacity-90">{a.content}</p>
              
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-emerald-600 font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                  View full details <i className="fa-solid fa-arrow-right"></i>
                </button>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-share-nodes text-xs"></i>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-bookmark text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementView;
