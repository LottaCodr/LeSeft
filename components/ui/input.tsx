import * as React from 'react';
import { cn } from '@/lib/utils';

const controlStyles =
  'flex w-full rounded-md border border-input bg-white text-[14px] text-[#1f4236] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-[#8b9a8f] hover:border-[#a9bda4] focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-[#f2f4ee] disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(controlStyles, 'h-12 px-4', className)} ref={ref} {...props} />
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
