import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { FeeRecord } from '../../types';

export const StudentFees: React.FC = () => {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFees() {
      try {
        const res = await apiRequest('/academics/fees');
        setFeeRecords(res.records || []);
      } catch (err) {
        console.error('Failed to load fee details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-campus-50 text-campus-700 border border-campus-200/80 mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Institutional Finance & Accounts</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Fee Structure & Payment Status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review tuition dues, laboratory allocations, and download verified electronic payment receipts.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Autumn 2026 Cleared</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Zero outstanding arrears for Semester 5</p>
        </div>
      </div>

      {/* Fee Invoices */}
      <div className="space-y-4">
        {feeRecords.map((fee) => (
          <div key={fee.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Term</span>
                <h3 className="text-base font-bold text-slate-900">
                  Semester {fee.semester} (Academic Year {fee.academic_year})
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {fee.status === 'paid' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" /> Due by {fee.due_date}
                  </span>
                )}
                {fee.receipt_url && (
                  <a
                    href={fee.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Tuition Component</span>
                <span className="font-bold text-slate-800 text-sm">₹{fee.tuition_fee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Laboratory & Tech Fee</span>
                <span className="font-bold text-slate-800 text-sm">₹{fee.lab_fee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Library & Campus Amenities</span>
                <span className="font-bold text-slate-800 text-sm">₹{fee.library_fee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Fee Payable</span>
                <span className="font-extrabold text-campus-700 text-sm">₹{fee.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

