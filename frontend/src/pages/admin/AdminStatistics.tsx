import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Vote, FileText, TrendingUp, Download } from 'lucide-react';

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
    { title: 'Total Members', value: stats?.totalUsers || 0, icon: Users },
    { title: 'Total Voters', value: stats?.totalVoters || 0, icon: Vote },
    { title: 'Total Votes', value: stats?.totalVotes || 0, icon: FileText },
    { title: 'Voter Turnout', value: stats?.voterTurnout ? `${stats.voterTurnout}%` : '0%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Statistics & Results</h1>
        <p className="text-sm text-muted-foreground">View voting statistics and export results</p>
      </div>

      <Card className="backdrop-blur-sm bg-card/90 border-2">
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : stats ? (
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
        ) : (
        <Card className="backdrop-blur-sm bg-card/90 border-2">
          <CardContent className="p-6 text-center text-muted-foreground">
            No statistics available.
          </CardContent>
        </Card>
      )}

      <Card className="backdrop-blur-sm bg-card/90 border-2">
        <CardContent className="p-6 text-center">
          <Link to="/results">
            <Button>
              View Detailed Results
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;
