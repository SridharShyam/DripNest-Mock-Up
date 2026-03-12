import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "new" | "sale" | "success" | "warning" | "error" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-charcoal text-white hover:bg-black/80",
    new: "bg-violet text-white hover:bg-violet/80",
    sale: "bg-red text-white hover:bg-red/80",
    success: "bg-green text-white hover:bg-green/80",
    warning: "bg-gold text-white hover:bg-gold/80",
    error: "bg-red text-white hover:bg-red/80",
    outline: "border border-charcoal text-charcoal",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
