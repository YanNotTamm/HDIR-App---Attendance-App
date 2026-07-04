import Link from 'next/link';
import { Users, MapPin, LayoutDashboard, LogOut, CheckSquare, Calendar } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-blue-600">HDIR Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Beranda</span>
          </Link>
          <Link href="/dashboard/employees" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Karyawan</span>
          </Link>
          <Link href="/dashboard/offices" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Lokasi Kantor</span>
          </Link>
          <Link href="/dashboard/approvals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Persetujuan</span>
          </Link>
          <Link href="/dashboard/leaves" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Kuota Cuti</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Panel HR</h2>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            HR
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
