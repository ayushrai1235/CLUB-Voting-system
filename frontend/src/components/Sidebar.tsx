import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Vote, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/positions', label: 'Positions', icon: Users },
    { to: '/admin/candidates', label: 'Candidates', icon: Vote },
    { to: '/admin/elections', label: 'Elections', icon: Calendar },
    { to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-full border-r border-border bg-card/95 backdrop-blur shadow-lg md:shadow-none">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
      </div>
      <nav className="space-y-1 px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 transition-transform duration-200" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
