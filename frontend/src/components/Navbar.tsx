import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(
        "relative text-sm font-medium transition-all duration-300 hover:text-primary",
        isActive(to) ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
      <span className={cn(
        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
        isActive(to) ? "w-full" : "w-0 hover:w-full"
      )} />
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all duration-200",
        isActive(to)
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
      {isActive(to) && <ChevronRight className="h-4 w-4" />}
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
        scrolled ? "glass-panel border-border/50 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Bit Mavericks"
            className="h-10 w-auto object-contain dark:invert transition-all duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            BitsMavericks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <NavLink to="/admin">Dashboard</NavLink>
                  <NavLink to="/results">Results</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/voting">Vote</NavLink>
                  <NavLink to="/apply">Apply</NavLink>
                  <NavLink to="/results">Results</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                </>
              )}
              <NavLink to="/leadership">Leadership</NavLink>
              <div className="h-6 w-px bg-border/50 mx-2" />
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Right side: Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-accent transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-xl transition-all duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: '60px' }}
      >
        <nav className="container p-4 space-y-2">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                  <MobileNavLink to="/results" onClick={() => setMobileMenuOpen(false)}>Results</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink to="/voting" onClick={() => setMobileMenuOpen(false)}>Vote</MobileNavLink>
                  <MobileNavLink to="/apply" onClick={() => setMobileMenuOpen(false)}>Apply</MobileNavLink>
                  <MobileNavLink to="/results" onClick={() => setMobileMenuOpen(false)}>Results</MobileNavLink>
                  <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</MobileNavLink>
                </>
              )}
              <MobileNavLink to="/leadership" onClick={() => setMobileMenuOpen(false)}>Leadership</MobileNavLink>
              <div className="h-px bg-border/50 my-4" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 font-medium"
              >
                Logout
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
              <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</MobileNavLink>
              <MobileNavLink to="/admin-login" onClick={() => setMobileMenuOpen(false)}>Admin Access</MobileNavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
