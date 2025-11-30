import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Vote, Calendar, BarChart3, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/positions', label: 'Positions', icon: Users },
    { to: '/admin/candidates', label: 'Candidates', icon: Vote },
    { to: '/admin/elections', label: 'Elections', icon: Calendar },
    { to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <aside className="w-full h-full flex flex-col border-r border-border/50 bg-card shadow-xl md:shadow-none transition-all duration-300">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Admin Panel
          </h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
