import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle2, XCircle, Trash2, User, Mail, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

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
    description: string;
  };
  manifesto: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const ManageCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/admin/candidates');
      setCandidates(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load candidates' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/admin/candidates/${id}/approve`);
      setMessage({ type: 'success', text: 'Candidate approved successfully' });
      fetchCandidates();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to approve' });
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this candidate?')) return;

    try {
      await api.put(`/admin/candidates/${id}/reject`);
      setMessage({ type: 'success', text: 'Candidate rejected successfully' });
      fetchCandidates();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reject' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this candidate application?')) return;

    try {
      await api.delete(`/admin/candidates/${id}`);
      setMessage({ type: 'success', text: 'Candidate deleted successfully' });
      fetchCandidates();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete' });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { class: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800', text: 'Pending' },
      approved: { class: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800', text: 'Approved' },
      rejected: { class: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', text: 'Rejected' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold border", badge.class)}>
        {badge.text}
      </span>
    );
  };

  const filteredCandidates = filter === 'all'
    ? candidates
    : candidates.filter(c => c.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Candidates</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <div className={cn(
          "rounded-xl border p-4 text-sm animate-in fade-in slide-in-from-top-2",
          message.type === 'success'
            ? "border-green-200 bg-green-50/50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
            : "border-red-200 bg-red-50/50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
        )}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <Card key={candidate._id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative h-24 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="absolute -bottom-10 left-6">
                      <img
                        src={
                          candidate.user.profilePhoto.startsWith('http')
                            ? candidate.user.profilePhoto
                            : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${candidate.user.profilePhoto}`
                        }
                        alt={candidate.user.name}
                        className="h-20 w-20 rounded-full border-4 border-background object-cover shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(candidate.status)}
                    </div>
                  </div>

                  <div className="pt-12 px-6 pb-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{candidate.user.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {candidate.user.email}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Running For</div>
                      <div className="font-semibold text-primary">{candidate.position.name}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        Manifesto
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 pl-6">
                        {candidate.manifesto}
                      </p>
                    </div>

                    <div className="pt-4 flex gap-2 border-t border-border/50">
                      {candidate.status === 'pending' && (
                        <>
                          <Button size="sm" className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(candidate._id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1 rounded-lg" onClick={() => handleReject(candidate._id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="rounded-lg ml-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50" onClick={() => handleDelete(candidate._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl border-dashed">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No candidates found matching your filter.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCandidates;
