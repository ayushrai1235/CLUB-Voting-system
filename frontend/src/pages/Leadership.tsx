import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users } from 'lucide-react';

interface Position {
  _id: string;
  name: string;
  description: string;
  isElected: boolean;
  isFixed: boolean;
}

const Leadership: React.FC = () => {
  const [fixedPositions, setFixedPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixedPositions();
  }, []);

  const fetchFixedPositions = async () => {
    try {
      const response = await api.get('/positions/fixed');
      setFixedPositions(response.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">Club Leadership</h1>
          <p className="text-sm text-muted-foreground">Fixed Leadership Positions (Not Elected)</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : fixedPositions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {fixedPositions.map((position) => (
              <Card key={position._id} className="backdrop-blur-sm bg-card/90 border-2 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{position.name}</CardTitle>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    Fixed (Not Elected)
                  </span>
                </CardHeader>
                <CardContent>
                  {position.description && (
                    <p className="text-sm text-muted-foreground">{position.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="backdrop-blur-sm bg-card/90 border-2">
            <CardContent className="p-6 text-center text-muted-foreground">
              No fixed leadership positions defined yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leadership;
