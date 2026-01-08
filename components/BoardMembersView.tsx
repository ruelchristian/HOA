
import React from 'react';
import { BoardMember, UserRole } from '../types';

interface Props {
  members: BoardMember[];
  role: UserRole;
}

const BoardMembersView: React.FC<Props> = ({ members, role }) => {
  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-xl text-white">
            <i className="fa-solid fa-users-gear text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Meet Your Board Members</h3>
            <p className="text-sm text-slate-600">Our dedicated team working to keep our community safe, clean, and vibrant.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-center group">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-emerald-600 mx-auto overflow-hidden">
                {member.avatar ? <img src={member.avatar} alt={member.name} /> : member.name.charAt(0)}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h4 className="text-lg font-bold text-slate-800">{member.name}</h4>
            <p className="text-sm font-semibold text-emerald-600 mb-4">{member.position}</p>
            
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                <i className="fa-solid fa-envelope w-4"></i>
                {member.email}
              </a>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <i className="fa-solid fa-phone w-4"></i>
                {member.phone}
              </div>
            </div>

            {role === UserRole.OFFICER && (
              <button className="mt-6 w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors uppercase tracking-widest">
                Edit Profile
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardMembersView;
