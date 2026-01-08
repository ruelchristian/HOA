
import React from 'react';
import { FeeRecord, Complaint, Announcement, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface Props {
  fees: FeeRecord[];
  complaints: Complaint[];
  announcements: Announcement[];
}

const OfficerDashboardView: React.FC<Props> = ({ fees, complaints, announcements }) => {
  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingRequests = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;
  const overdueFees = fees.filter(f => f.status === 'Overdue').length;

  const collectionData = [
    { name: 'Monthly Dues', value: fees.filter(f => f.type === 'Monthly Dues' && f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0) },
    { name: 'Security', value: fees.filter(f => f.type === 'Security Fee' && f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0) },
    { name: 'Others', value: fees.filter(f => !['Monthly Dues', 'Security Fee'].includes(f.type) && f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0) },
  ];

  const requestStats = [
    { name: 'Maintenance', value: complaints.filter(c => c.requestType === 'Maintenance').length },
    { name: 'Security', value: complaints.filter(c => c.requestType === 'Security').length },
    { name: 'Admin', value: complaints.filter(c => c.requestType === 'Admin').length },
    { name: 'Landscaping', value: complaints.filter(c => c.requestType === 'Landscaping').length },
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-vault text-xl"></i>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Funds Collected</p>
          <h3 className="text-2xl font-bold text-slate-800">${totalCollected.toLocaleString()}</h3>
          <p className="text-xs text-emerald-500 mt-2 font-semibold">
            <i className="fa-solid fa-arrow-up mr-1"></i> 12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-clock-rotate-left text-xl"></i>
          </div>
          <p className="text-sm font-medium text-slate-500">Active Requests</p>
          <h3 className="text-2xl font-bold text-slate-800">{pendingRequests}</h3>
          <p className="text-xs text-slate-400 mt-2">Requires board attention</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
          </div>
          <p className="text-sm font-medium text-slate-500">Overdue Payments</p>
          <h3 className="text-2xl font-bold text-slate-800">{overdueFees}</h3>
          <p className="text-xs text-red-500 mt-2 font-semibold">Action Required</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-bullhorn text-xl"></i>
          </div>
          <p className="text-sm font-medium text-slate-500">Total Notices</p>
          <h3 className="text-2xl font-bold text-slate-800">{announcements.length}</h3>
          <p className="text-xs text-slate-400 mt-2">Published to community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-800">Collection Breakdown</h4>
            <select className="text-xs border-none bg-slate-50 rounded-lg px-2 py-1 outline-none font-bold text-slate-500">
              <option>Current Quarter</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-8">Service Request Distribution</h4>
          <div className="h-72 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {requestStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4 px-4">
              {requestStats.map((stat, index) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-sm text-slate-600 font-medium">{stat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboardView;
