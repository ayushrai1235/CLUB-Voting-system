import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, ArrowRight, Vote, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Election {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'upcoming' | 'ended';
}

const ElectionList: React.FC = () => {
    const navigate = useNavigate();
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await api.get('/elections/active');
            // Ensure we always have an array, even if API returns null or undefined
            setElections(Array.isArray(response.data) ? response.data : []);
        } catch (error: any) {
            setError('Failed to load elections');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const activeElections = elections.filter(e => e.status === 'active');
    const upcomingElections = elections.filter(e => e.status === 'upcoming');

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

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-12 relative z-10">
                {/* Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Elections</h1>
                    <p className="text-lg text-muted-foreground">
                        Participate in active elections or view upcoming ones. Your vote shapes the future.
                    </p>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-destructive/10 text-destructive text-center border border-destructive/20">
                        {error}
                    </div>
                )}

                {/* Active Elections Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">Active Elections</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {activeElections.length}
                        </span>
                    </div>

                    {activeElections.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeElections.map((election) => (
                                <Card key={election._id} className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                Live Now
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl mb-2">{election.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{election.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4 mr-2" />
                                                Ends: {new Date(election.endDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} at {new Date(election.endDate).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <Button
                                                onClick={() => navigate(`/voting/${election._id}`)}
                                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                            >
                                                Vote Now
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/30">
                            <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No Active Elections</h3>
                            <p className="text-muted-foreground">There are currently no elections in progress.</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Elections Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-blue-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">Upcoming Elections</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                            {upcomingElections.length}
                        </span>
                    </div>

                    {upcomingElections.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingElections.map((election) => (
                                <Card key={election._id} className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                                                Upcoming
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl mb-2">{election.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{election.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Starts: {new Date(election.startDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                            </div>
                                            <Button disabled variant="outline" className="w-full opacity-70 cursor-not-allowed">
                                                Not Started Yet
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/30">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No Upcoming Elections</h3>
                            <p className="text-muted-foreground">Check back later for future elections.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ElectionList;
