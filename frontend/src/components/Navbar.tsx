import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

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

  const navLinks = user ? (
    user.role === 'admin' ? (
      <>
        <Link
          to="/admin"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/admin') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Dashboard
        </Link>
        <Link
          to="/results"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/results') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Results
        </Link>
      </>
    ) : (
      <>
        <Link
          to="/voting"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/voting') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Vote
        </Link>
        <Link
          to="/apply"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/apply') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Apply
        </Link>
        <Link
          to="/results"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/results') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Results
        </Link>
        <Link
          to="/profile"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            isActive('/profile') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Profile
        </Link>
      </>
    )
  ) : (
    <>
      <Link
        to="/login"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive('/login') ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Login
      </Link>
      <Link
        to="/signup"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive('/signup') ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Sign Up
      </Link>
      <Link
        to="/admin-login"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive('/admin-login') ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Admin
      </Link>
    </>
  );

  // Create array of mobile menu items for staggered animation
  const getMobileMenuItems = () => {
    const items = [];
    
    // Add nav links as individual items
    if (user) {
      if (user.role === 'admin') {
        items.push(
          <Link
            key="admin-dashboard"
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/admin') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>,
          <Link
            key="admin-results"
            to="/results"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/results') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Results
          </Link>
        );
      } else {
        items.push(
          <Link
            key="voting"
            to="/voting"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/voting') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Vote
          </Link>,
          <Link
            key="apply"
            to="/apply"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/apply') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Apply
          </Link>,
          <Link
            key="results"
            to="/results"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/results') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Results
          </Link>,
          <Link
            key="profile"
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block text-sm font-medium transition-colors hover:text-foreground py-2",
              isActive('/profile') ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Profile
          </Link>
        );
      }
      items.push(
        <Link
          key="leadership"
          to="/leadership"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "block text-sm font-medium transition-colors hover:text-foreground py-2",
            isActive('/leadership') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Leadership
        </Link>,
        <button
          key="logout"
          onClick={handleLogout}
          className="block w-full text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
        >
          Logout
        </button>
      );
    } else {
      items.push(
        <Link
          key="login"
          to="/login"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "block text-sm font-medium transition-colors hover:text-foreground py-2",
            isActive('/login') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Login
        </Link>,
        <Link
          key="signup"
          to="/signup"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "block text-sm font-medium transition-colors hover:text-foreground py-2",
            isActive('/signup') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Sign Up
        </Link>,
        <Link
          key="admin-login"
          to="/admin-login"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "block text-sm font-medium transition-colors hover:text-foreground py-2",
            isActive('/admin-login') ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Admin
        </Link>
      );
    }
    
    return items;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold text-foreground transition-opacity hover:opacity-80">
          Club Voting System
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks}
          {user && (
            <>
              <Link
                to="/leadership"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive('/leadership') ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Leadership
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Right side: Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-accent transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-0" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides down from top */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen 
            ? "max-h-screen opacity-100" 
            : "max-h-0 opacity-0"
        )}
      >
        <nav className="container px-4 border-t border-border bg-background/95 backdrop-blur">
          <div className={cn(
            "space-y-1 transition-all duration-300",
            mobileMenuOpen ? "py-4" : "py-0"
          )}>
            {getMobileMenuItems().map((item, index) => (
              <div
                key={item.key || index}
                className={cn(
                  "transition-all duration-300 ease-out",
                  mobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
