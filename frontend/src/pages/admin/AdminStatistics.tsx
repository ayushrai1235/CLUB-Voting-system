import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Vote, FileText, TrendingUp, Download, ArrowRight } from 'lucide-react';

interface Statistics {
  totalUsers: number;
  totalVoters: number;
  totalVotes: number;
  voterTurnout: string;
}

interface Election {
  _id: string;
  name: string;
}

const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchElectionStats(selectedElection);
    } else {
      fetchStats();
    }
  }, [selectedElection]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    }
  };

  const fetchElectionStats = async (electionId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/results/summary/${electionId}`);
      if (response.data.statistics) {
        setStats(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch election stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedElection) {
      alert('Please select an election first');
      return;
    }
    try {
      const response = await api.get(`/results/export/${selectedElection}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `election-results-${selectedElection}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      alert('Failed to export results');
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Total Voters',
      value: stats?.totalVoters || 0,
      icon: Vote,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Total Votes',
      value: stats?.totalVotes || 0,
      icon: FileText,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Voter Turnout',
      value: stats?.voterTurnout ? `${stats.voterTurnout}%` : '0%',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Statistics & Results</h1>
        <p className="text-muted-foreground">View voting statistics and export results</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="election-select" className="text-sm font-medium text-foreground mb-2 block">
                Select Election (Optional)
              </label>
              <select
                id="election-select"
                value={selectedElection}
                onChange={(e) => setSelectedElection(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="">All Elections</option>
                {elections.map((election) => (
                  <option key={election._id} value={election._id}>
                    {election.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedElection && (
              <Button onClick={handleExport} variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : stats ? (
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
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/50 to-transparent opacity-50`} />
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="p-12 text-center text-muted-foreground">
            No statistics available.
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-md transition-all">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-semibold">Want deeper insights?</h3>
            <p className="text-muted-foreground">Check out the detailed results page for comprehensive breakdowns.</p>
            <Link to="/results">
              <Button className="rounded-xl px-8">
                View Detailed Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;
