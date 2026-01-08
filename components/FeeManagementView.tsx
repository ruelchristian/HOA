
import React, { useState } from 'react';
import { FeeRecord, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  fees: FeeRecord[];
  role: UserRole;
  currentUserId: string;
  onUpdateFee: (id: string, status: FeeRecord['status']) => void;
}

const FeeManagementView: React.FC<Props> = ({ fees, role, currentUserId, onUpdateFee }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  // Filter fees if resident
  const displayFees = role === UserRole.RESIDENT 
    ? fees.filter(f => f.userId === currentUserId) 
    : fees;

  const chartData = [
    { name: 'Paid', value: fees.filter(f => f.status === 'Paid').length },
    { name: 'Unpaid', value: fees.filter(f => f.status === 'Unpaid').length },
    { name: 'Overdue', value: fees.filter(f => f.status === 'Overdue').length },
  ];

  const totalAmount = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const collectedAmount = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  const myOutstanding = displayFees
    .filter(f => f.status !== 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const gateways = [
    { name: 'GCash', color: 'bg-blue-600', icon: 'fa-mobile-screen' },
    { name: 'Maya', color: 'bg-green-600', icon: 'fa-wallet' },
    { name: 'Credit Card', color: 'bg-slate-800', icon: 'fa-credit-card' },
    { name: 'Bank Transfer', color: 'bg-emerald-600', icon: 'fa-building-columns' },
  ];

  const handlePayClick = (fee: FeeRecord) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (selectedFee) {
      onUpdateFee(selectedFee.id, 'Paid');
      setShowPaymentModal(false);
      setSelectedFee(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer View: Global Stats */}
      {role === UserRole.OFFICER ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 uppercase">Collection Rate</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{Math.round((collectedAmount / totalAmount) * 100)}%</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(collectedAmount / totalAmount) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Collected</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">${collectedAmount.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-2">From current billing cycle</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Outstanding</p>
            <p className="text-3xl font-bold text-red-500 mt-2">${(totalAmount - collectedAmount).toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-2">Requires immediate follow-up</p>
          </div>
        </div>
      ) : (
        /* Resident View: Personal Balance */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Your Total Balance</p>
              <h3 className="text-5xl font-bold mt-2">${myOutstanding.toFixed(2)}</h3>
              <p className="text-emerald-400 text-sm mt-4 flex items-center gap-2">
                <i className="fa-solid fa-circle-info"></i>
                Includes monthly dues and late fees
              </p>
            </div>
            <i className="fa-solid fa-file-invoice-dollar absolute -bottom-4 -right-4 text-white/5 text-9xl"></i>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-slate-800 font-bold text-lg mb-1">Quick Actions</h4>
            <p className="text-slate-500 text-sm mb-6">Settling your dues helps us maintain the community.</p>
            <div className="flex gap-3">
               <button 
                onClick={() => {
                  const firstUnpaid = displayFees.find(f => f.status !== 'Paid');
                  if (firstUnpaid) handlePayClick(firstUnpaid);
                }}
                disabled={myOutstanding === 0}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  myOutstanding > 0 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
               >
                <i className="fa-solid fa-credit-card"></i>
                Pay Outstanding
               </button>
               <button className="px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                 <i className="fa-solid fa-download"></i>
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === UserRole.OFFICER && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6">Payment Status Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Paid' ? '#10b981' : entry.name === 'Unpaid' ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${role === UserRole.OFFICER ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">
              {role === UserRole.RESIDENT ? 'My Payment History & Dues' : 'Community Fee Records'}
            </h3>
            <div className="flex gap-2">
              <button className="text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-100">Filter</button>
              <button className="text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-100">Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-3 px-2">Due Date</th>
                  {role === UserRole.OFFICER && <th className="pb-3 px-2">Resident</th>}
                  <th className="pb-3 px-2">Description</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayFees.map(f => (
                  <tr key={f.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 text-slate-500">{f.dueDate}</td>
                    {role === UserRole.OFFICER && <td className="py-4 px-2 font-medium">{f.userName}</td>}
                    <td className="py-4 px-2">
                      <div className="font-semibold text-slate-800">{f.type}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Invoice #INV-{f.id}</div>
                    </td>
                    <td className="py-4 px-2 text-right font-bold text-slate-800">${f.amount.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ${
                        f.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                        f.status === 'Unpaid' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {role === UserRole.OFFICER ? (
                        <select 
                          value={f.status}
                          onChange={(e) => onUpdateFee(f.id, e.target.value as any)}
                          className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Paid">Mark Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      ) : (
                        f.status !== 'Paid' ? (
                          <button 
                            onClick={() => handlePayClick(f)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button className="text-slate-400 hover:text-emerald-600 p-2">
                            <i className="fa-solid fa-receipt"></i>
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-slate-800">Complete Payment</h4>
                <p className="text-sm text-slate-500">Invoice: {selectedFee?.type}</p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="text-slate-600 font-medium">Total to Pay</span>
                <span className="text-2xl font-black text-emerald-700">${selectedFee?.amount.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  {gateways.map(gw => (
                    <button 
                      key={gw.name}
                      onClick={confirmPayment}
                      className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all gap-2"
                    >
                      <div className={`w-12 h-12 rounded-xl ${gw.color} text-white flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                        <i className={`fa-solid ${gw.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                <i className="fa-solid fa-shield-check mr-1 text-emerald-500"></i>
                Secure encrypted transaction powered by HOA Connect Pay
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagementView;
