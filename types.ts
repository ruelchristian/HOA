
export enum UserRole {
  RESIDENT = 'RESIDENT',
  OFFICER = 'OFFICER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  address: string;
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  avatar?: string;
}

export type AnnouncementCategory = 'General' | 'Community Events' | 'Sports & Wellness' | 'Volunteer & Participation';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'High' | 'Normal' | 'Low';
  category?: AnnouncementCategory;
}

export type RequestType = 'Maintenance' | 'Security' | 'Landscaping' | 'Complaint' | 'Admin';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  requestType: RequestType;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface FeeRecord {
  id: string;
  userId: string;
  userName: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}
