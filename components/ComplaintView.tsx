
import React, { useState } from 'react';
import { Complaint, UserRole, RequestType } from '../types';

interface Props {
  complaints: Complaint[];
  role: UserRole;
  onUpdateStatus: (id: string, status: Complaint['status']) => void;
  onSubmit: (c: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ComplaintView: React.FC<Props> = ({ complaints, role, onUpdateStatus, onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    requestType: 'Maintenance' as RequestType 
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId: 'u1', // Defaulting to current user for demo
      userName: 'John Doe',
      status: 'Pending'
    });
    setFormData({ title: '', description: '', requestType: 'Maintenance' });
    setShowForm(false);
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Closed': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const typeIcons: Record<RequestType, string> = {
    'Maintenance': 'fa-tools text-orange-500',
    'Security': 'fa-shield-halved text-blue-500',
    'Landscaping': 'fa-leaf text-emerald-500',
    'Complaint': 'fa-circle-exclamation text-red-500',
    'Admin': 'fa-user-tie text-slate-500'
  };

  return (
    <div className="space-y-6">
      {role === UserRole.RESIDENT && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Help Center</h3>
            <p className="text-slate-500 text-sm">Need a repair or have a concern? Submit a request below.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus-circle'}`}></i>
            {showForm ? 'Close Form' : 'New Service Request'}
          </button>
        </div>
      )}

      {showForm && (
        <form 
          onSubmit={handleFormSubmit} 
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">Submit Service Request</h3>
            <p className="text-sm text-slate-500">Please provide accurate details to help our team respond quickly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Request Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Maintenance', 'Security', 'Landscaping', 'Admin'] as RequestType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, requestType: type})}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${
                      formData.requestType === type 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`fa-solid ${typeIcons[type]} opacity-70`}></i>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Brief Summary</label>
              <input 
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 transition-all" 
                placeholder="E.g., Front gate sensor not working"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
            <textarea 
              required
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 transition-all"
              placeholder="Describe the issue in detail, including the exact location..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 font-bold transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Submit to Board
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-800">Recent Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Summary</th>
                {role === UserRole.OFFICER && <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Resident</th>}
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={role === UserRole.OFFICER ? 5 : 4} className="px-6 py-16 text-center text-slate-400 italic">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl text-slate-200">
                        <i className="fa-solid fa-clipboard-list"></i>
                      </div>
                      <span>No active requests found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                complaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <i className={`fa-solid ${typeIcons[c.requestType || 'Complaint']} text-sm`}></i>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{c.requestType || 'Complaint'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{c.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <i className="fa-regular fa-calendar"></i>
                        {c.createdAt}
                      </div>
                    </td>
                    {role === UserRole.OFFICER && (
                      <td className="px-6 py-5 font-semibold text-sm text-slate-600">{c.userName}</td>
                    )}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {role === UserRole.OFFICER ? (
                        <select 
                          className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-600 cursor-pointer shadow-sm hover:border-slate-300"
                          value={c.status}
                          onChange={e => onUpdateStatus(c.id, e.target.value as any)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">Working</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      ) : (
                        <button className="text-slate-300 hover:text-emerald-600 w-8 h-8 rounded-full hover:bg-emerald-50 transition-all">
                          <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintView;
