import type React from "react"
import { cn } from "@/lib/utils"

interface AuthComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AuthCard({ className, children, ...props }: AuthComponentProps) {
  return (
    <div
      className={cn(
        "relative w-full space-y-6 rounded-xl border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl",
        "lg:p-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface AuthTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function AuthDescription({ className, children, ...props }: AuthTextProps) {
  return (
    <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props}>
      {children}
    </p>
  )
}

interface AuthTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function AuthTitle({ className, children, ...props }: AuthTitleProps) {
  return (
    <h1
      className={cn(
        "text-2xl font-bold tracking-tight text-primary",
        "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function AuthMessage({ className, children, ...props }: AuthTextProps) {
  return (
    <p className={cn("text-sm font-medium text-muted-foreground", "rounded-lg bg-muted/50 p-4", className)} {...props}>
      {children}
    </p>
  )
}

