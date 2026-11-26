import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex cursor-pointer select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-[3px] text-[15px] font-extrabold tracking-[0.02em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] disabled:cursor-not-allowed [&_svg]:size-[1.1em] [&_svg]:shrink-0 [&_svg]:stroke-[2.25]',
  {
    variants: {
      variant: {
        default:
          'bg-[#0f362c] text-white shadow-[0_2px_4px_rgba(11,45,37,0.25)] hover:bg-[#1c4f40] hover:shadow-[0_6px_18px_rgba(11,45,37,0.35)] disabled:bg-[#e3e7dd] disabled:text-[#6f7d71] disabled:shadow-none',
        light:
          'bg-[#e9f2d9] text-[#0e281f] shadow-[0_2px_4px_rgba(11,45,37,0.22)] hover:bg-[#d3e4b5] hover:shadow-[0_6px_18px_rgba(11,45,37,0.3)] disabled:bg-[#e3e7dd] disabled:text-[#6f7d71] disabled:shadow-none',
        secondary:
          'bg-[#e7ecdf] text-[#122b21] hover:bg-[#d9e2cd] disabled:bg-[#eef0ea] disabled:text-[#9aa696]',
        outline:
          'border-[1.5px] border-[#8fa98f] bg-transparent text-[#10382c] hover:border-[#0f362c] hover:bg-[#0f362c] hover:text-white disabled:border-[#dfe4db] disabled:bg-transparent disabled:text-[#9aa696]',
        ondark:
          'border-[1.5px] border-[#cfe3bd]/70 bg-[#0c2b21]/90 text-white shadow-[0_2px_6px_rgba(0,0,0,0.45)] hover:border-[#e6f3d6] hover:bg-[#123d2e] disabled:border-white/20 disabled:text-white/50',
        ghost:
          'bg-transparent text-[#10382c] hover:bg-[#e9f2d9] hover:text-[#0e281f]',
        link:
          'text-[#0f362c] underline-offset-4 decoration-2 hover:underline',
        destructive:
          'bg-[#b3261e] text-white hover:bg-[#8f1d16]',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-10 px-4 text-[13px]',
        lg: 'h-[54px] px-7 text-[14px]',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
