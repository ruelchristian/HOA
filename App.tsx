
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import AnnouncementView from './components/AnnouncementView';
import ComplaintView from './components/ComplaintView';
import FeeManagementView from './components/FeeManagementView';
import BoardMembersView from './components/BoardMembersView';
import OfficerDashboardView from './components/OfficerDashboardView';
import { Announcement, Complaint, FeeRecord, UserRole, BoardMember } from './types';
import { MOCK_USER, INITIAL_ANNOUNCEMENTS, INITIAL_COMPLAINTS, INITIAL_FEES, INITIAL_BOARD_MEMBERS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState(MOCK_USER);
  const [activeTab, setActiveTab] = useState(user.role === UserRole.OFFICER ? 'dashboard' : 'announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [fees, setFees] = useState<FeeRecord[]>(INITIAL_FEES);
  const [boardMembers] = useState<BoardMember[]>(INITIAL_BOARD_MEMBERS);

  const switchRole = useCallback(() => {
    setUser(prev => {
      const newRole = prev.role === UserRole.OFFICER ? UserRole.RESIDENT : UserRole.OFFICER;
      // Auto-switch tab if the current one isn't available for the new role
      if (newRole === UserRole.RESIDENT && activeTab === 'dashboard') {
        setActiveTab('announcements');
      } else if (newRole === UserRole.OFFICER && activeTab === 'announcements') {
        setActiveTab('dashboard');
      }
      return { ...prev, role: newRole };
    });
  }, [activeTab]);

  const addAnnouncement = (a: Omit<Announcement, 'id'>) => {
    const newId = `a${announcements.length + 1}`;
    setAnnouncements([{ ...a, id: newId }, ...announcements]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString().split('T')[0] } : c
    ));
  };

  const addComplaint = (c: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComplaint: Complaint = {
      ...c,
      id: `c${complaints.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setComplaints([newComplaint, ...complaints]);
  };

  const updateFeeStatus = (id: string, status: FeeRecord['status']) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  return (
    <Layout 
      user={user} 
      onRoleSwitch={switchRole} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && user.role === UserRole.OFFICER && (
        <OfficerDashboardView 
          fees={fees} 
          complaints={complaints} 
          announcements={announcements} 
        />
      )}

      {activeTab === 'announcements' && (
        <AnnouncementView 
          announcements={announcements} 
          role={user.role} 
          onAdd={addAnnouncement} 
        />
      )}
      
      {activeTab === 'complaints' && (
        <ComplaintView 
          complaints={complaints} 
          role={user.role} 
          onUpdateStatus={updateComplaintStatus}
          onSubmit={addComplaint}
        />
      )}
      
      {activeTab === 'fees' && (
        <FeeManagementView 
          fees={fees} 
          role={user.role} 
          currentUserId={user.id}
          onUpdateFee={updateFeeStatus}
        />
      )}

      {activeTab === 'board' && (
        <BoardMembersView 
          members={boardMembers}
          role={user.role}
        />
      )}
    </Layout>
  );
};

export default App;
