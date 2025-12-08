import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Vote, CheckCircle2, Loader2, AlertCircle, User, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from '../components/ui/modal';

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
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidatesByPosition, setCandidatesByPosition] = useState<Record<string, Candidate[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchElectionData();
  }, []);

  const fetchElectionData = async () => {
    try {
      if (!electionId) {
        setMessage({ type: 'error', text: 'No election specified' });
        setLoading(false);
        return;
      }

      const electionRes = await api.get(`/elections/${electionId}`);

      if (electionRes.data) {
        setElection(electionRes.data);
        await loadElectionDetails(electionRes.data);
      } else {
        setMessage({ type: 'error', text: 'Election not found' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load election data' });
    } finally {
      setLoading(false);
    }
  };

  const loadElectionDetails = async (activeElection: Election) => {
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
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl text-center p-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Vote className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Active Election</h2>
            <p className="text-muted-foreground">There are currently no elections in progress. Please check back later.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (election.status === 'ended') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl text-center p-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Voting Completed</h2>
            <p className="text-muted-foreground mb-8">The election "{election.name}" has ended. You can now view the results.</p>
            <Button
              onClick={() => navigate('/results')}
              className="w-full rounded-xl shadow-lg shadow-primary/20"
              size="lg"
            >
              View Results
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12 relative z-10">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Election
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">{election.name}</h1>
          <p className="text-lg text-muted-foreground">Cast your votes for the future leaders. Your voice matters.</p>
        </div>

        {message && (
          <div className={cn(
            "max-w-2xl mx-auto mb-8 rounded-xl border p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
            message.type === 'success'
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          )}>
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-12 max-w-5xl mx-auto">
          {positions.map((position) => (
            <div key={position._id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{position.name}</h2>
                  {position.description && (
                    <p className="text-muted-foreground mt-1">{position.description}</p>
                  )}
                </div>
                {hasVoted[position._id] && (
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-900/50">
                    <CheckCircle2 className="h-4 w-4" />
                    Voted
                  </div>
                )}
              </div>

              {candidatesByPosition[position._id]?.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {candidatesByPosition[position._id].map((candidate) => {
                    const isSelected = selectedCandidates[position._id] === candidate._id;
                    const isDisabled = hasVoted[position._id];

                    return (
                      <div
                        key={candidate._id}
                        className={cn(
                          "group relative rounded-2xl border bg-card transition-all duration-300 overflow-hidden flex flex-col",
                          isSelected
                            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-[1.02]"
                            : "border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
                          isDisabled && "opacity-60 cursor-not-allowed hover:transform-none hover:shadow-none hover:border-border/50"
                        )}
                        onClick={() => !isDisabled && handleCandidateSelect(position._id, candidate._id)}
                      >
                        <div className="aspect-square relative overflow-hidden bg-muted">
                          <img
                            src={
                              candidate.user.profilePhoto.startsWith('http')
                                ? candidate.user.profilePhoto
                                : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${candidate.user.profilePhoto}`
                            }
                            alt={candidate.user.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                          {isSelected && (
                            <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                              <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                            </div>
                          )}

                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewCandidate(candidate);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-foreground mb-1">{candidate.user.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                            {candidate.manifesto}
                          </p>
                        </div>

                        {!isDisabled && isSelected && (
                          <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/50 animate-in slide-in-from-bottom-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubmitVote(position._id);
                              }}
                              disabled={submitting}
                              className="w-full rounded-xl shadow-lg shadow-primary/20"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Confirming...
                                </>
                              ) : (
                                <>
                                  Confirm Vote
                                  <Vote className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">No candidates available for this position</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Details Modal */}
      <Modal
        isOpen={!!viewCandidate}
        onClose={() => setViewCandidate(null)}
        title="Candidate Profile"
      >
        {viewCandidate && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div
                className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary/10 mb-4 shadow-xl cursor-zoom-in transition-transform hover:scale-105"
                onClick={() => {
                  const imgUrl = viewCandidate.user.profilePhoto.startsWith('http')
                    ? viewCandidate.user.profilePhoto
                    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${viewCandidate.user.profilePhoto}`;
                  window.open(imgUrl, '_blank');
                }}
                title="Click to view full size"
              >
                <img
                  src={
                    viewCandidate.user.profilePhoto.startsWith('http')
                      ? viewCandidate.user.profilePhoto
                      : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${viewCandidate.user.profilePhoto}`
                  }
                  alt={viewCandidate.user.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{viewCandidate.user.name}</h3>
              <p className="text-muted-foreground">{viewCandidate.position.name}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Manifesto
              </h4>
              <div className="p-4 rounded-xl bg-muted/50 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {viewCandidate.manifesto}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setViewCandidate(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Voting;
