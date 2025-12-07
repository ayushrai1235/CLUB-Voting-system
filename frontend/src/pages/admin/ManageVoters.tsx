import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { User, Mail, Eye, Trash2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Modal } from '../../components/ui/modal';

interface Voter {
    _id: string;
    name: string;
    email: string;
    profilePhoto: string;
    role: string;
    createdAt: string;
}

const ManageVoters: React.FC = () => {
    const [voters, setVoters] = useState<Voter[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchVoters();
    }, []);

    const fetchVoters = async () => {
        try {
            const response = await api.get('/admin/users');
            setVoters(response.data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load voters' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this voter? This action cannot be undone.')) return;

        try {
            // Assuming there's an endpoint to delete users. If not, this might need adjustment.
            // Based on adminController.js, there isn't a specific deleteUser, but usually it's standard.
            // If not present, I'll just show a message or add it to backend if needed.
            // Checking adminController.js again... it has getUsers but no deleteUser.
            // I will assume for now we might need to add it, or just disable the button if not available.
            // Wait, I should check if I can add it to backend. The user asked for "do the same for voters".
            // "Same" implies viewing details. Deletion wasn't explicitly asked but is good to have.
            // I'll add the UI for it but maybe comment it out or implement backend if I can.
            // For now let's try to hit a likely endpoint or just focus on View.
            // Actually, let's stick to View as requested primarily.
            // But "do the same" implies full management.
            // I'll add the delete call, if it fails, I'll handle error.
            await api.delete(`/admin/users/${id}`);
            setMessage({ type: 'success', text: 'Voter deleted successfully' });
            fetchVoters();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete voter' });
        }
    };

    const filteredVoters = voters.filter(voter =>
        voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Voters</h1>
                <p className="text-muted-foreground">View and manage registered voters</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
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
                    {filteredVoters.length > 0 ? (
                        filteredVoters.map((voter) => (
                            <Card key={voter._id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-0">
                                    <div className="relative h-24 bg-gradient-to-r from-primary/10 to-primary/5">
                                        <div className="absolute -bottom-10 left-6">
                                            <img
                                                src={
                                                    voter.profilePhoto.startsWith('http')
                                                        ? voter.profilePhoto
                                                        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${voter.profilePhoto}`
                                                }
                                                alt={voter.name}
                                                className="h-20 w-20 rounded-full border-4 border-background object-cover shadow-md cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => setEnlargedImage(
                                                    voter.profilePhoto.startsWith('http')
                                                        ? voter.profilePhoto
                                                        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${voter.profilePhoto}`
                                                )}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-12 px-6 pb-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{voter.name}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {voter.email}
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-2 border-t border-border/50">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="flex-1 rounded-lg"
                                                onClick={() => setSelectedVoter(voter)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                            {/* 
                      <Button size="sm" variant="outline" className="rounded-lg ml-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50" onClick={() => handleDelete(voter._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      */}
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
                                    <p>No voters found matching your search.</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Voter Details Modal */}
            {selectedVoter && (
                <Modal
                    isOpen={!!selectedVoter}
                    onClose={() => setSelectedVoter(null)}
                    title="Voter Details"
                    className="max-w-md"
                >
                    <div className="space-y-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <img
                                src={
                                    selectedVoter.profilePhoto.startsWith('http')
                                        ? selectedVoter.profilePhoto
                                        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedVoter.profilePhoto}`
                                }
                                alt={selectedVoter.name}
                                className="h-32 w-32 rounded-full border-4 border-background object-cover shadow-xl cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setEnlargedImage(
                                    selectedVoter.profilePhoto.startsWith('http')
                                        ? selectedVoter.profilePhoto
                                        : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedVoter.profilePhoto}`
                                )}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                }}
                            />
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">{selectedVoter.name}</h3>
                                <div className="flex items-center justify-center text-muted-foreground mt-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {selectedVoter.email}
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    Joined: {new Date(selectedVoter.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Image Enlargement Modal */}
            {enlargedImage && (
                <Modal
                    isOpen={!!enlargedImage}
                    onClose={() => setEnlargedImage(null)}
                    className="max-w-4xl bg-transparent border-none shadow-none p-0"
                >
                    <div className="flex items-center justify-center h-full">
                        <img
                            src={enlargedImage}
                            alt="Enlarged profile"
                            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageVoters;
