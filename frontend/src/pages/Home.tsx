import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Vote, Users, BarChart3, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg pattern-dots relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <section className="mb-12 md:mb-16">
          <Card className="backdrop-blur-sm bg-card/80 border-2 transition-all duration-300 ease-in-out">
            <CardHeader className="text-center px-4 md:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary transition-transform duration-300" />
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Club Voting System
                </CardTitle>
              </div>
              <CardDescription className="text-base md:text-lg">
                A professional platform for managing club elections
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center px-4 md:px-6">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 w-full sm:w-auto">
                <Link to="/signup" className="inline-block w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login" className="inline-block w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                    Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:scale-105 transition-all duration-300 ease-in-out border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Vote className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <CardTitle>Secure Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cast your vote securely with our encrypted voting system
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 ease-in-out border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your club's leadership team and their roles
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 ease-in-out border-2 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <BarChart3 className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View election results after voting ends
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;
