import { cn } from "@/lib/utils"

export function AuthCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative w-full space-y-6 p-6 lg:p-10", className)} {...props}>
      {children}
    </div>
  )
}

export function AuthDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function AuthTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-2xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h1>
  )
}

export function AuthMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-medium text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

