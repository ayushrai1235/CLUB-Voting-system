import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Vote, Clock, Calendar, ArrowUpRight } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  pendingApplications: number;
  activeElections: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Members',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: 'Registered users',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Total Candidates',
      value: stats?.totalCandidates || 0,
      icon: Vote,
      description: 'Approved candidates',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Active Elections',
      value: stats?.activeElections || 0,
      icon: Calendar,
      description: 'Currently running',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back to the admin control panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  {stat.value > 0 && (
                    <div className="flex items-center text-xs text-green-500 font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Active
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/50 to-transparent opacity-50`} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverview;
