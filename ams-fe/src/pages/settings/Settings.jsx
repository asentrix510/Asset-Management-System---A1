export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure system preferences and options</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <p className="text-slate-700 font-semibold">System Settings</p>
        <p className="text-slate-400 text-sm mt-1">Settings module coming soon.</p>
      </div>
    </div>
  );
}