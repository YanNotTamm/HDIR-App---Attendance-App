'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Edit, Trash } from 'lucide-react';
import { officesApi } from '@hdir/core/src/api-client';

export default function OfficesPage() {
  const [offices, setOffices] = useState<any[]>([]);

  useEffect(() => {
    officesApi.getAll()
      .then(res => setOffices(res.data))
      .catch(err => console.error("Failed to load offices:", err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lokasi Kantor (Geofence)</h1>
          <p className="text-slate-500">Atur titik koordinat dan radius presensi (Geofencing).</p>
        </div>
        <button className="glass-button px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Lokasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offices.map((office) => (
          <div key={office.id} className="glass-panel p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{office.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium">Radius: {office.radius}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between text-sm text-slate-500">
              <span>Lat: {office.lat}</span>
              <span>Lng: {office.lng}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
