"use client";
import { useEffect, useState } from 'react';

export default function AttendanceModal({ isOpen, onClose, batch, students = [] }) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // initialize records from students
    const init = (students || []).map(s => ({ studentEmail: s.studentEmail || s.email, status: 'Present', remark: '' }));
    setRecords(init);
  }, [isOpen, students]);

  const setStatus = (idx, status) => {
    setRecords(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], status };
      return copy;
    });
  };

  const setRemark = (idx, remark) => {
    setRecords(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], remark };
      return copy;
    });
  };

  const handleSave = async () => {
    if (!batch) return alert('Batch not selected');
    setSaving(true);
    try {
      const payload = { batchId: batch.id, date, records };
      const res = await fetch('/api/attendance-records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Saved attendance (${data.inserted ?? 0} records)`);
        onClose();
      } else {
        console.error('Save failed', await res.text());
        alert('Failed to save attendance');
      }
    } catch (err) {
      console.error('Error saving attendance', err);
      alert('Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Mark Attendance - {batch?.courseName || ''}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">Close</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border rounded" />
            <div className="text-sm text-gray-500">Students: {students.length}</div>
          </div>

          <div className="max-h-72 overflow-y-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Trainee</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Remark</th>
                </tr>
              </thead>
              <tbody>
                {(students || []).map((s, idx) => (
                  <tr key={s.studentEmail || s.email} className="border-b">
                    <td className="px-3 py-2">{s.firstName ? `${s.firstName} ${s.lastName || ''}` : s.email || s.studentEmail}</td>
                    <td className="px-3 py-2 text-center">
                      <select value={records[idx]?.status || 'Present'} onChange={(e) => setStatus(idx, e.target.value)} className="px-2 py-1 border rounded">
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Leave</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input value={records[idx]?.remark || ''} onChange={(e) => setRemark(idx, e.target.value)} className="w-full px-2 py-1 border rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-60">{saving ? 'Saving...' : 'Save Attendance'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
