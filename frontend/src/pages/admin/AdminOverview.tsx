import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Vote, Clock, Calendar } from 'lucide-react';

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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Members', value: stats?.totalUsers || 0, icon: Users },
    { title: 'Total Candidates', value: stats?.totalCandidates || 0, icon: Vote },
    { title: 'Pending Applications', value: stats?.pendingApplications || 0, icon: Clock },
    { title: 'Active Elections', value: stats?.activeElections || 0, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor your voting system at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="backdrop-blur-sm bg-card/90 border-2 hover:scale-105 transition-transform duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverview;
