import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "success" | "warning" | "danger" | "neutral" }
>(({ className, variant = "neutral", ...props }, ref) => {
  const variants = {
    success: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    warning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-neutral-700/30 text-neutral-300 border-neutral-600/30",
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };