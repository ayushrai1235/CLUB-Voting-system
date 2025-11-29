import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Trophy, Download, Users, TrendingUp, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface Result {
  position: {
    id: string;
    name: string;
    description: string;
  };
  candidates: Array<{
    id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      profilePhoto: string;
    };
    manifesto: string;
    voteCount: number;
  }>;
  totalVotes: number;
  winner: {
    user: {
      name: string;
      profilePhoto: string;
    };
    voteCount: number;
  } | null;
}

interface Election {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ResultsData {
  election: Election;
  results: Result[];
  statistics?: {
    totalUsers: number;
    totalVoters: number;
    voterTurnout: string;
  };
}

const Results: React.FC = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchResults(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data);
      const endedElections = response.data.filter((e: Election) => {
        return new Date(e.endDate) < new Date();
      });
      if (endedElections.length > 0) {
        setSelectedElection(endedElections[0]._id);
      }
    } catch (error: any) {
      setError('Failed to load elections');
    }
  };

  const fetchResults = async (electionId: string) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = user?.role === 'admin' 
        ? `/results/summary/${electionId}`
        : `/results/election/${electionId}`;
      const response = await api.get(endpoint);
      setResults(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedElection) return;
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
      setError('Failed to export results');
    }
  };

  return (
    <div className="min-h-screen gradient-bg-subtle pattern-grid relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <Navbar />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Election Results</h1>
          <p className="text-sm text-muted-foreground">View detailed results from past elections</p>
        </div>

        {elections.length > 0 && (
          <Card className="mb-6 backdrop-blur-sm bg-card/90 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <label htmlFor="election-select" className="text-sm font-medium text-foreground mb-2 block">
                    Select Election
                  </label>
                  <select
                    id="election-select"
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {elections.map((election) => (
                      <option key={election._id} value={election._id}>
                        {election.name} ({new Date(election.endDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                {user?.role === 'admin' && selectedElection && (
                  <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : results ? (
          <div className="space-y-8">
            <Card className="backdrop-blur-sm bg-card/90 border-2">
              <CardHeader>
                <CardTitle className="text-xl">{results.election.name}</CardTitle>
                {results.election.description && (
                  <p className="text-sm text-muted-foreground mt-2">{results.election.description}</p>
                )}
              </CardHeader>
              {user?.role === 'admin' && results.statistics && (
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Users</p>
                        <p className="text-lg font-semibold text-foreground">{results.statistics.totalUsers}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Voters</p>
                        <p className="text-lg font-semibold text-foreground">{results.statistics.totalVoters}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Voter Turnout</p>
                        <p className="text-lg font-semibold text-foreground">{results.statistics.voterTurnout}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {results.results.map((result) => (
              <Card key={result.position.id} className="backdrop-blur-sm bg-card/90 border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{result.position.name}</CardTitle>
                  {result.position.description && (
                    <p className="text-sm text-muted-foreground mt-1">{result.position.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">Total Votes: {result.totalVotes}</p>
                </CardHeader>
                <CardContent>
                  {result.winner && (
                    <div className="mb-6 rounded-lg border-2 border-primary bg-primary/10 backdrop-blur-sm p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Winner</h3>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${result.winner.user.profilePhoto}`}
                          alt={result.winner.user.name}
                          className="h-20 w-20 rounded-full object-cover border-2 border-primary mb-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-avatar.png';
                          }}
                        />
                        <h4 className="text-lg font-semibold text-foreground mb-1">{result.winner.user.name}</h4>
                        <p className="text-sm font-medium text-primary">{result.winner.voteCount} votes</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">All Candidates</h4>
                    <div className="space-y-3">
                      {result.candidates
                        .sort((a, b) => b.voteCount - a.voteCount)
                        .map((candidate, index) => {
                          const percentage = result.totalVotes > 0 ? (candidate.voteCount / result.totalVotes) * 100 : 0;
                          return (
                            <div
                              key={candidate.id}
                              className={cn(
                                "flex flex-col sm:flex-row items-center gap-4 rounded-lg border p-4 transition-all duration-300",
                                index === 0 && result.winner && "bg-primary/5 border-primary"
                              )}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${candidate.user.profilePhoto}`}
                                alt={candidate.user.name}
                                className="h-12 w-12 rounded-full object-cover border border-border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-foreground">{candidate.user.name}</h5>
                                  <span className="text-sm font-semibold text-foreground">{candidate.voteCount} votes</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="backdrop-blur-sm bg-card/90 border-2">
            <CardContent className="p-6 text-center text-muted-foreground">
              No results available. Select an election to view results.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
