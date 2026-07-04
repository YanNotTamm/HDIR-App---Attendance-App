import { Users, Building, Activity } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Hari Ini</h1>
        <p className="text-slate-500">Pantau aktivitas karyawan Anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-500">Total Karyawan</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">120</p>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-500">Kantor Cabang</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Building className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">4</p>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-500">Hadir Hari Ini</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">98</p>
        </div>
      </div>
    </div>
  );
}
