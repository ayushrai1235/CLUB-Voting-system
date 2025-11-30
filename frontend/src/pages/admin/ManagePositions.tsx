import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { X, Edit, Trash2, Plus, Award, Shield } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Positions</h1>
          <p className="text-muted-foreground">Create and manage election positions</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', description: '', isElected: true, isFixed: false }); }}
          className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Position
        </Button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg backdrop-blur-xl bg-card/95 border-border/50 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50">
              <CardTitle>{editing ? 'Edit Position' : 'Create Position'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Position Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="e.g. President"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Describe the responsibilities..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all",
                    formData.isElected ? "border-primary bg-primary/5" : "border-input hover:bg-accent"
                  )}>
                    <input
                      type="checkbox"
                      checked={formData.isElected}
                      onChange={(e) => setFormData({ ...formData, isElected: e.target.checked })}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-sm font-medium">Is Elected</span>
                  </label>
                  <label className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all",
                    formData.isFixed ? "border-primary bg-primary/5" : "border-input hover:bg-accent"
                  )}>
                    <input
                      type="checkbox"
                      checked={formData.isFixed}
                      onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-sm font-medium">Is Fixed</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl">
                    {editing ? 'Update Position' : 'Create Position'}
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {positions.map((position) => (
            <Card key={position._id} className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(position)} className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(position._id)} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{position.name}</h3>
                {position.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{position.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {position.isFixed && (
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Shield className="mr-1 h-3 w-3" />
                      Fixed
                    </span>
                  )}
                  {position.isElected && !position.isFixed && (
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Award className="mr-1 h-3 w-3" />
                      Elected
                    </span>
                  )}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePositions;
