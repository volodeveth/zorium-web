'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'default',
    size = 'default',
    asChild = false,
    isLoading = false,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-xl font-semibold",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          
          // Variants
          variant === 'default' && [
            "bg-gradient-to-r from-[#be1103] to-[#d41404]",
            "text-white",
            "hover:shadow-lg hover:shadow-[#be1103]/20 hover:scale-105",
          ],
          variant === 'outline' && [
            "border-2 border-[#be1103]",
            "text-[#be1103]",
            "hover:bg-[#be1103]/10",
          ],
          variant === 'ghost' && [
            "text-[#be1103]",
            "hover:bg-[#be1103]/10",
          ],

          // Sizes
          size === 'sm' && "px-4 py-2 text-sm",
          size === 'default' && "px-6 py-3",
          size === 'lg' && "px-8 py-4 text-lg",

          // Loading state
          isLoading && "opacity-70 cursor-not-allowed",

          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };