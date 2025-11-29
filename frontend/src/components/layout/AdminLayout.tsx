import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen gradient-bg-subtle pattern-grid relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <Navbar />
      
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 rounded-md bg-card border border-border shadow-lg hover:bg-accent transition-all duration-300"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 transition-transform duration-300" />
        ) : (
          <Menu className="h-5 w-5 transition-transform duration-300" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "md:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 p-4 md:p-6 w-full md:w-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
