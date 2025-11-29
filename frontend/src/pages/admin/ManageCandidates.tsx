import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
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
      pending: { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', text: 'Pending' },
      approved: { class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', text: 'Approved' },
      rejected: { class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', text: 'Rejected' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium", badge.class)}>
        {badge.text}
      </span>
    );
  };

  const filteredCandidates = filter === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Manage Candidates</h1>
        <p className="text-sm text-muted-foreground">Review and manage candidate applications</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {message && (
        <div className={cn(
          "rounded-lg border p-4 text-sm",
          message.type === 'success' 
            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
            : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
        )}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <Card key={candidate._id} className="backdrop-blur-sm bg-card/90 border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={`http://localhost:5000${candidate.user.profilePhoto}`}
                      alt={candidate.user.name}
                      className="h-20 w-20 rounded-full border-2 border-border object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{candidate.user.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.user.email}</p>
                          <p className="mt-1 text-sm font-medium text-foreground">
                            Position: {candidate.position.name}
                          </p>
                        </div>
                        {getStatusBadge(candidate.status)}
                      </div>
                      <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
                        <p className="text-sm font-medium text-foreground">Manifesto:</p>
                        <p className="mt-1 text-sm text-muted-foreground">{candidate.manifesto}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {candidate.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(candidate._id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(candidate._id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDelete(candidate._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="backdrop-blur-sm bg-card/90 border-2">
              <CardContent className="p-6 text-center text-muted-foreground">
                No candidates found.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCandidates;
