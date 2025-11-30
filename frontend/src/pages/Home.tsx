import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Vote, Users, BarChart3, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center text-center">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-float">
            <Sparkles className="h-4 w-4" />
            <span>The Future of Club Elections</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Vote with <span className="text-gradient">Confidence</span> & <span className="text-gradient">Transparency</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A secure, modern, and transparent platform for managing Bits Mavericks club's leadership elections. Empower your members to make their voices heard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                Member Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-24 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Secure & Encrypted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Every vote is encrypted and securely stored. Our system ensures complete anonymity and integrity of the election process.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Candidate Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Explore detailed manifestos and profiles of all candidates. Make informed decisions before casting your valuable vote.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Watch the results unfold in real-time with beautiful, interactive charts and analytics once the election concludes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Club Voting System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
