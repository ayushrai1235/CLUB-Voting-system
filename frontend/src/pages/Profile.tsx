import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface Application {
  _id: string;
  position: {
    _id: string;
    name: string;
    description: string;
  };
  manifesto: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/candidates/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { 
        class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        icon: Clock,
        text: 'Pending' 
      },
      approved: { 
        class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        icon: CheckCircle2,
        text: 'Approved' 
      },
      rejected: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        icon: XCircle,
        text: 'Rejected' 
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", badge.class)}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">My Profile</h1>
          <p className="text-sm text-muted-foreground">View your profile and application status</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-8">
          <Card className="md:col-span-1 backdrop-blur-sm bg-card/90 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user?.profilePhoto}`}
                  alt={user?.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-border mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <h2 className="text-xl font-semibold text-foreground mb-1">{user?.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <User className="mr-1 h-3 w-3" />
                  {user?.role}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 backdrop-blur-sm bg-card/90 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Candidate Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app._id} className="backdrop-blur-sm bg-card/80 border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{app.position.name}</h3>
                            {app.position.description && (
                              <p className="text-sm text-muted-foreground">{app.position.description}</p>
                            )}
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Manifesto:</p>
                          <p className="text-sm text-foreground">{app.manifesto}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Applied on: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't applied for any positions yet.</p>
                  <Link to="/apply">
                    <Button>
                      Apply as Candidate
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
