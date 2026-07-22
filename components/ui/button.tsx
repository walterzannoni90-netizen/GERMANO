import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    // Varianti adattate al tema scuro del sito (le classi dark: non erano mai attive,
    // quindi i bottoni chiari risultavano invisibili su sfondo scuro)
    const variants = {
      default: "bg-neutral-800 text-white hover:bg-neutral-700",
      destructive: "bg-red-600 text-white hover:bg-red-500",
      outline: "border border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white",
      secondary: "bg-neutral-800 text-neutral-50 hover:bg-neutral-700",
      ghost: "text-neutral-300 hover:bg-neutral-800 hover:text-white",
      link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
      primary: "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20",
      accent: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8 text-base",
      icon: "h-10 w-10 p-2",
    };
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
