import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { X, Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Position {
  _id: string;
  name: string;
  description: string;
  isElected: boolean;
  isFixed: boolean;
}

const ManagePositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isElected: true,
    isFixed: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get('/admin/positions');
      setPositions(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load positions' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editing) {
        await api.put(`/admin/positions/${editing._id}`, formData);
        setMessage({ type: 'success', text: 'Position updated successfully' });
      } else {
        await api.post('/admin/positions', formData);
        setMessage({ type: 'success', text: 'Position created successfully' });
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '', isElected: true, isFixed: false });
      fetchPositions();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (position: Position) => {
    setEditing(position);
    setFormData({
      name: position.name,
      description: position.description || '',
      isElected: position.isElected,
      isFixed: position.isFixed
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;

    try {
      await api.delete(`/admin/positions/${id}`);
      setMessage({ type: 'success', text: 'Position deleted successfully' });
      fetchPositions();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Manage Positions</h1>
          <p className="text-sm text-muted-foreground">Create and manage election positions</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', description: '', isElected: true, isFixed: false }); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Position
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
          <Card className="w-full max-w-lg backdrop-blur-sm bg-card/95 border-2 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editing ? 'Edit Position' : 'Create Position'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditing(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Position Name *</label>
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isElected"
                    checked={formData.isElected}
                    onChange={(e) => setFormData({ ...formData, isElected: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                  <label htmlFor="isElected" className="text-sm font-medium text-foreground">
                    Is Elected
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFixed"
                    checked={formData.isFixed}
                    onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                  <label htmlFor="isFixed" className="text-sm font-medium text-foreground">
                    Is Fixed (Not Elected - e.g., President, VP)
                  </label>
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
          {positions.map((position) => (
            <Card key={position._id} className="backdrop-blur-sm bg-card/90 border-2 hover:shadow-lg transition-all">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{position.name}</h3>
                  {position.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{position.description}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    {position.isFixed && (
                      <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                        Fixed
                      </span>
                    )}
                    {position.isElected && !position.isFixed && (
                      <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                        Elected
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(position)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(position._id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePositions;
