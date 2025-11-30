import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { X, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Election {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  positions: Array<{ _id: string; name: string }>;
}

interface Position {
  _id: string;
  name: string;
}

const ManageElections: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Election | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    positions: [] as string[]
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchElections();
    fetchPositions();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/admin/elections');
      setElections(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load elections' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get('/positions');
      setPositions(response.data);
    } catch (error) {
      console.error('Failed to load positions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setMessage({ type: 'error', text: 'End date must be after start date' });
      return;
    }

    try {
      if (editing) {
        await api.put(`/admin/elections/${editing._id}`, formData);
        setMessage({ type: 'success', text: 'Election updated successfully' });
      } else {
        await api.post('/admin/elections', formData);
        setMessage({ type: 'success', text: 'Election created successfully' });
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '', startDate: '', endDate: '', positions: [] });
      fetchElections();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (election: Election) => {
    setEditing(election);
    setFormData({
      name: election.name,
      description: election.description || '',
      startDate: new Date(election.startDate).toISOString().slice(0, 16),
      endDate: new Date(election.endDate).toISOString().slice(0, 16),
      positions: election.positions.map(p => p._id)
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this election?')) return;

    try {
      await api.delete(`/admin/elections/${id}`);
      setMessage({ type: 'success', text: 'Election deleted successfully' });
      fetchElections();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  const togglePosition = (positionId: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(positionId)
        ? prev.positions.filter(id => id !== positionId)
        : [...prev.positions, positionId]
    }));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'Upcoming' },
      active: { class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', text: 'Active' },
      ended: { class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', text: 'Ended' },
    };
    const badge = badges[status as keyof typeof badges] || badges.upcoming;
    return (
      <span className={cn("rounded-full px-2 py-1 text-xs font-medium", badge.class)}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Manage Elections</h1>
          <p className="text-sm text-muted-foreground">Create and manage election schedules</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', description: '', startDate: '', endDate: '', positions: [] }); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Election
        </Button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm bg-card/95 border-2 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editing ? 'Edit Election' : 'Create Election'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditing(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Election Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Start Date & Time *</label>
                    <div className="relative">
                      <input
                        ref={startDateRef}
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        onClick={() => startDateRef.current?.showPicker()}
                        required
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10 cursor-pointer"
                      />
                      <Calendar
                        className="absolute right-3 top-1/2 translate-y-0 h-4 w-4 text-muted-foreground cursor-pointer pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">End Date & Time *</label>
                    <div className="relative">
                      <input
                        ref={endDateRef}
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        onClick={() => endDateRef.current?.showPicker()}
                        required
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10 cursor-pointer"
                      />
                      <Calendar
                        className="absolute right-3 top-1/2 translate-y-0 h-4 w-4 text-muted-foreground cursor-pointer pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Positions (Select positions for this election)</label>
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-input bg-muted/50 p-4">
                    <div className="grid gap-2 md:grid-cols-2">
                      {positions.map((position) => (
                        <label key={position._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.positions.includes(position._id)}
                            onChange={() => togglePosition(position._id)}
                            className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                          />
                          <span className="text-sm text-foreground">{position.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editing ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {elections.length > 0 ? (
            elections.map((election) => (
              <Card key={election._id} className="backdrop-blur-sm bg-card/90 border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">{election.name}</h3>
                        {getStatusBadge(election.status)}
                      </div>
                      {election.description && (
                        <p className="text-sm text-muted-foreground mb-3">{election.description}</p>
                      )}
                      <div className="space-y-1 text-sm">
                        <p className="text-foreground">
                          <span className="font-medium">Start:</span>{' '}
                          <span className="text-muted-foreground">{new Date(election.startDate).toLocaleString()}</span>
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">End:</span>{' '}
                          <span className="text-muted-foreground">{new Date(election.endDate).toLocaleString()}</span>
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Positions:</span>{' '}
                          <span className="text-muted-foreground">{election.positions.length} position(s)</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(election)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(election._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="backdrop-blur-sm bg-card/90 border-2">
              <CardContent className="p-6 text-center text-muted-foreground">
                No elections found. Create your first election to get started.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageElections;
