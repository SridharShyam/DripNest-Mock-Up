import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "violet";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-black text-white hover:bg-black/90",
      violet: "bg-violet text-white hover:bg-violet/90",
      outline: "border border-neutral-200 bg-transparent hover:bg-mist text-black",
      ghost: "hover:bg-mist text-black",
      danger: "bg-red text-white hover:bg-red/90"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-sm px-3",
      md: "h-11 px-6 py-3",
      lg: "h-14 rounded-sm px-8 text-lg",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
