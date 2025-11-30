import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Trophy, Download, Users, TrendingUp, FileText, Loader2, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12 relative z-10">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Election Results</h1>
          <p className="text-muted-foreground">View detailed outcomes and statistics from past elections</p>
        </div>

        {elections.length > 0 && (
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-xl shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                  <label htmlFor="election-select" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Select Election
                  </label>
                  <select
                    id="election-select"
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {elections.map((election) => (
                      <option key={election._id} value={election._id}>
                        {election.name} ({new Date(election.endDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                {user?.role === 'admin' && selectedElection && (
                  <Button onClick={handleExport} variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : results ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Overview Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardHeader>
                <CardTitle className="text-2xl">{results.election.name}</CardTitle>
                {results.election.description && (
                  <p className="text-muted-foreground mt-2">{results.election.description}</p>
                )}
              </CardHeader>
              {user?.role === 'admin' && results.statistics && (
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold text-foreground">{results.statistics.totalUsers}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50">
                      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Voters</p>
                        <p className="text-2xl font-bold text-foreground">{results.statistics.totalVoters}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50">
                      <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Turnout</p>
                        <p className="text-2xl font-bold text-foreground">{results.statistics.voterTurnout}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Results by Position */}
            <div className="grid gap-8">
              {results.results.map((result) => (
                <Card key={result.position.id} className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{result.position.name}</CardTitle>
                        {result.position.description && (
                          <p className="text-sm text-muted-foreground mt-1">{result.position.description}</p>
                        )}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-background border border-border/50 text-xs font-medium text-muted-foreground">
                        {result.totalVotes} Votes Cast
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {result.winner && (
                      <div className="mb-8 flex justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
                          <div className="relative flex flex-col items-center bg-card rounded-xl p-6 border border-yellow-500/20 shadow-xl">
                            <div className="absolute -top-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                              <Trophy className="h-3 w-3" /> WINNER
                            </div>
                            <img
                              src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${result.winner.user.profilePhoto}`}
                              alt={result.winner.user.name}
                              className="h-24 w-24 rounded-full object-cover border-4 border-yellow-500/20 mb-3"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                              }}
                            />
                            <h4 className="text-xl font-bold text-foreground">{result.winner.user.name}</h4>
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                              {result.winner.voteCount} votes ({(result.totalVotes > 0 ? (result.winner.voteCount / result.totalVotes) * 100 : 0).toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Vote Breakdown</h4>
                      <div className="space-y-4">
                        {result.candidates
                          .sort((a, b) => b.voteCount - a.voteCount)
                          .map((candidate, index) => {
                            const percentage = result.totalVotes > 0 ? (candidate.voteCount / result.totalVotes) * 100 : 0;
                            const isWinner = index === 0 && result.winner;

                            return (
                              <div key={candidate.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                    <span className={cn(
                                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                      isWinner ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-muted text-muted-foreground"
                                    )}>
                                      {index + 1}
                                    </span>
                                    <span className="font-medium text-foreground">{candidate.user.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">{candidate.voteCount} votes</span>
                                    <span className="font-bold w-12 text-right">{percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-1000 ease-out",
                                      isWinner ? "bg-yellow-500" : "bg-primary/50"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                  />
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
          </div>
        ) : (
          <Card className="max-w-lg mx-auto border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="p-12 text-center text-muted-foreground">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Results Found</h3>
              <p>Select an election from the dropdown above to view its results.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
