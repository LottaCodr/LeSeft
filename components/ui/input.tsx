import * as React from 'react';
import { cn } from '@/lib/utils';

const controlStyles =
  'flex w-full rounded-md border border-input bg-background text-[13px] text-[#1f4236] shadow-sm outline-none transition-colors placeholder:text-[#7d8f83] hover:border-[#b7c6b4] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(controlStyles, 'h-11 px-3.5', className)} ref={ref} {...props} />
  )
);
Input.displayName = 'Input';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(controlStyles, 'min-h-[140px] resize-y px-3.5 py-3', className)} ref={ref} {...props} />
  )
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
