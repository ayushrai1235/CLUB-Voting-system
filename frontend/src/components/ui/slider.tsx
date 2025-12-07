import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[];
    onValueChange: (value: number[]) => void;
    max?: number;
    min?: number;
    step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
        return (
            <input
                type="range"
                className={cn(
                    "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
                    className
                )}
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={(e) => onValueChange([parseFloat(e.target.value)])}
                ref={ref}
                {...props}
            />
        );
    }
);

Slider.displayName = "Slider";
