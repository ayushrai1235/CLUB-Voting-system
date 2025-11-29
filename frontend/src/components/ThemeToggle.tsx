import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
          theme === 'dark' ? "translate-x-7" : "translate-x-0"
        )}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-foreground" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;

