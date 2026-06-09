import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, pageTitle }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle={pageTitle} />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}