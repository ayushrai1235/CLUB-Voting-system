import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, FileText, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface Position {
  _id: string;
  name: string;
  description: string;
  isElected: boolean;
  isFixed: boolean;
}

const CandidateApplication: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get('/positions/elected');
      setPositions(response.data);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load positions' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedPosition || !manifesto.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/candidates/apply', {
        positionId: selectedPosition,
        manifesto: manifesto.trim()
      });

      setMessage({ type: 'success', text: 'Application submitted successfully! Waiting for admin approval.' });
      setSelectedPosition('');
      setManifesto('');

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit application' });
    } finally {
      setSubmitting(false);
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">Apply as Candidate</h1>
          <p className="text-sm text-muted-foreground">Submit your application to run for a position</p>
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

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-1 backdrop-blur-sm bg-card/90 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    user?.profilePhoto?.startsWith('http')
                      ? user.profilePhoto
                      : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user?.profilePhoto}`
                  }
                  alt={user?.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-border mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <p className="font-semibold text-foreground mb-1">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Your profile photo will be used on the candidate card</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 backdrop-blur-sm bg-card/90 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="position" className="text-sm font-medium text-foreground mb-2 block">
                    Select Position *
                  </label>
                  <select
                    id="position"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Choose a position...</option>
                    {positions.map((position) => (
                      <option key={position._id} value={position._id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                  {selectedPosition && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {positions.find(p => p._id === selectedPosition)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="manifesto" className="text-sm font-medium text-foreground mb-2 block">
                    Manifesto / Description *
                  </label>
                  <textarea
                    id="manifesto"
                    value={manifesto}
                    onChange={(e) => setManifesto(e.target.value)}
                    required
                    placeholder="Describe why you're the best candidate for this position, your goals, and what you plan to achieve..."
                    rows={8}
                    disabled={submitting}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">This will be displayed on your candidate card</p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !selectedPosition || !manifesto.trim()}
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateApplication;
