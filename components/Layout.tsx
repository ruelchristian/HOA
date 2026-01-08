
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onRoleSwitch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onRoleSwitch, activeTab, setActiveTab }) => {
  const tabs = [
    ...(user.role === UserRole.OFFICER ? [{ id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' }] : []),
    { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' },
    { id: 'complaints', label: 'Complaints', icon: 'fa-comment-dots' },
    { id: 'fees', label: 'Fees & Billing', icon: 'fa-file-invoice-dollar' },
    { id: 'board', label: 'Board Members', icon: 'fa-users' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-house-chimney text-emerald-400"></i>
            HOA Connect
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Management Pro</p>
        </div>

        <nav className="mt-4 px-3 space-y-1 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${tab.icon} w-5`}></i>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
            <button 
              onClick={onRoleSwitch}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              title="Switch Role (Demo)"
            >
              <i className="fa-solid fa-shuffle"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-4 md:p-10 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">
              {activeTab === 'board' ? 'HOA Board' : activeTab}
            </h2>
            <p className="text-slate-500">Welcome back to your community dashboard.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
              <i className="fa-solid fa-location-dot text-emerald-500 mr-2"></i>
              {user.address}
            </span>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
