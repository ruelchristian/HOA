
import { Announcement, Complaint, FeeRecord, UserRole, BoardMember } from './types';

export const MOCK_USER = {
  id: 'u1',
  name: 'John Doe',
  role: UserRole.OFFICER, 
  address: '123 Oak Street'
};

export const INITIAL_BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'bm1',
    name: 'Robert Wilson',
    position: 'President',
    email: 'president@hoaconnect.com',
    phone: '(555) 123-4567'
  },
  {
    id: 'bm2',
    name: 'Sarah Jenkins',
    position: 'Vice President',
    email: 'vpresident@hoaconnect.com',
    phone: '(555) 234-5678'
  },
  {
    id: 'bm3',
    name: 'Michael Chen',
    position: 'Treasurer',
    email: 'treasurer@hoaconnect.com',
    phone: '(555) 345-6789'
  },
  {
    id: 'bm4',
    name: 'Emily Davis',
    position: 'Secretary',
    email: 'secretary@hoaconnect.com',
    phone: '(555) 456-7890'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Annual General Meeting 2024',
    content: 'Please join us for the annual meeting to discuss the budget and community improvements on June 15th.',
    date: '2024-05-20',
    author: 'HOA Board',
    priority: 'High',
    category: 'Community Events'
  },
  {
    id: 'a2',
    title: 'Zumba Morning Sessions',
    content: 'Get active! Join us every Saturday at the clubhouse for free Zumba classes starting at 7 AM.',
    date: '2024-05-18',
    author: 'Wellness Comm.',
    priority: 'Normal',
    category: 'Sports & Wellness'
  },
  {
    id: 'a3',
    title: 'Tree Planting Volunteers Needed',
    content: 'We are looking for 20 volunteers to help beautify our perimeter fence this coming Sunday.',
    date: '2024-05-22',
    author: 'Admin',
    priority: 'Normal',
    category: 'Volunteer & Participation'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'John Doe',
    title: 'Broken Streetlight',
    description: 'The streetlight in front of House 123 has been flickering for three days.',
    requestType: 'Maintenance',
    status: 'In Progress',
    createdAt: '2024-05-21',
    updatedAt: '2024-05-22'
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'f1',
    userId: 'u1',
    userName: 'John Doe',
    type: 'Monthly Dues',
    amount: 50.00,
    dueDate: '2024-06-01',
    status: 'Unpaid'
  },
  {
    id: 'f2',
    userId: 'u2',
    userName: 'Jane Smith',
    type: 'Security Fee',
    amount: 15.00,
    dueDate: '2024-05-15',
    status: 'Paid'
  }
];
