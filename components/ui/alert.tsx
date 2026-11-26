import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-md border px-4 py-3.5 text-[12px] leading-relaxed',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-foreground',
        warning: 'border-[var(--warning-border)] bg-[var(--warning)] text-[var(--warning-foreground)]',
        success: 'border-transparent bg-success text-success-foreground',
        destructive: 'border-transparent bg-[var(--error-surface)] text-[var(--error-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, role, ...props }, ref) => (
  <div
    ref={ref}
    role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

export { Alert, alertVariants };
