import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex cursor-pointer select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-[3px] text-[14px] font-bold tracking-[0.015em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] disabled:cursor-not-allowed [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(11,45,37,0.18)] hover:bg-[#1d4b3d] hover:shadow-[0_4px_14px_rgba(11,45,37,0.28)] disabled:bg-[#e3e7dd] disabled:text-[#8a978c] disabled:shadow-none',
        light:
          'bg-accent text-accent-foreground shadow-[0_1px_2px_rgba(11,45,37,0.15)] hover:bg-[#cddfb2] hover:shadow-[0_4px_14px_rgba(11,45,37,0.25)] disabled:bg-[#e3e7dd] disabled:text-[#8a978c] disabled:shadow-none',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[#dde5d6] disabled:bg-[#eef0ea] disabled:text-[#a6b0a2]',
        outline:
          'border-[1.5px] border-[#b9c9b4] bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:border-[#dfe4db] disabled:bg-transparent disabled:text-[#a6b0a2]',
        ondark:
          'border-[1.5px] border-white/35 bg-white/10 text-white backdrop-blur-[2px] hover:border-white/70 hover:bg-white/20 disabled:border-white/20 disabled:text-white/50',
        ghost:
          'bg-transparent text-primary hover:bg-accent hover:text-accent-foreground',
        link:
          'text-primary underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-[#9c1f18]',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-10 px-4 text-[12.5px]',
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
