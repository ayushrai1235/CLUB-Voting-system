import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Vote, CheckCircle2, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface Position {
  _id: string;
  name: string;
  description: string;
  isElected: boolean;
  isFixed: boolean;
}

interface Candidate {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profilePhoto: string;
  };
  position: {
    _id: string;
    name: string;
  };
  manifesto: string;
}

interface Election {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

const Voting: React.FC = () => {
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidatesByPosition, setCandidatesByPosition] = useState<Record<string, Candidate[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchElectionData();
  }, []);

  const fetchElectionData = async () => {
    try {
      const electionRes = await api.get('/elections/active');
      if (!electionRes.data) {
        setMessage({ type: 'error', text: 'No active election at the moment' });
        setLoading(false);
        return;
      }

      const activeElection = electionRes.data;
      setElection(activeElection);

      const positionsRes = await api.get('/positions/elected');
      const electedPositions = positionsRes.data;
      setPositions(electedPositions);

      const candidatesMap: Record<string, Candidate[]> = {};
      for (const position of electedPositions) {
        const candidatesRes = await api.get(`/candidates/position/${position._id}`);
        const shuffled = candidatesRes.data.sort(() => Math.random() - 0.5);
        candidatesMap[position._id] = shuffled;

        const voteCheck = await api.get(`/votes/check/${activeElection._id}/${position._id}`);
        if (voteCheck.data.hasVoted) {
          setHasVoted(prev => ({ ...prev, [position._id]: true }));
        }
      }
      setCandidatesByPosition(candidatesMap);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load election data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (positionId: string, candidateId: string) => {
    if (hasVoted[positionId]) return;
    setSelectedCandidates(prev => ({ ...prev, [positionId]: candidateId }));
  };

  const handleSubmitVote = async (positionId: string) => {
    if (!election || !selectedCandidates[positionId]) {
      setMessage({ type: 'error', text: 'Please select a candidate' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post('/votes/cast', {
        electionId: election._id,
        positionId: positionId,
        candidateId: selectedCandidates[positionId]
      });

      setHasVoted(prev => ({ ...prev, [positionId]: true }));
      setMessage({ type: 'success', text: 'Vote cast successfully!' });
      setSelectedCandidates(prev => {
        const newState = { ...prev };
        delete newState[positionId];
        return newState;
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to cast vote' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-subtle pattern-grid">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen gradient-bg-subtle pattern-grid">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="backdrop-blur-sm bg-card/90 border-2">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">No Active Election</h2>
              <p className="text-muted-foreground">There is no active election at the moment. Please check back later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-subtle pattern-grid relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <Navbar />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">{election.name}</h1>
          <p className="text-sm text-muted-foreground">Select your preferred candidate for each position</p>
        </div>

        {message && (
          <div className={cn(
            "mb-6 rounded-lg border p-4 text-sm",
            message.type === 'success' 
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
          )}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {positions.map((position) => (
            <Card key={position._id} className="backdrop-blur-sm bg-card/90 border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{position.name}</CardTitle>
                    {position.description && (
                      <p className="text-sm text-muted-foreground">{position.description}</p>
                    )}
                  </div>
                  {hasVoted[position._id] && (
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Voted
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {candidatesByPosition[position._id]?.length > 0 ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                      {candidatesByPosition[position._id].map((candidate) => {
                        const isSelected = selectedCandidates[position._id] === candidate._id;
                        const isDisabled = hasVoted[position._id];
                        
                        return (
                          <Card
                            key={candidate._id}
                              className={cn(
                              "cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 backdrop-blur-sm bg-card/90 border-2",
                              isSelected && "ring-2 ring-primary border-primary shadow-xl scale-105",
                              isDisabled && "opacity-60 cursor-not-allowed hover:scale-100"
                            )}
                            onClick={() => !isDisabled && handleCandidateSelect(position._id, candidate._id)}
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                  <img
                                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${candidate.user.profilePhoto}`}
                                    alt={candidate.user.name}
                                    className="h-24 w-24 rounded-full object-cover border-2 border-border"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/default-avatar.png';
                                    }}
                                  />
                                  {isSelected && (
                                    <div className="absolute -top-1 -right-1 rounded-full bg-primary p-1">
                                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                  )}
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{candidate.user.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">{candidate.manifesto}</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {!hasVoted[position._id] && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSubmitVote(position._id)}
                          disabled={!selectedCandidates[position._id] || submitting}
                          className="min-w-[120px]"
                        >
                          <Vote className="mr-2 h-4 w-4" />
                          {submitting ? 'Submitting...' : 'Submit Vote'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No candidates available for this position</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Voting;
