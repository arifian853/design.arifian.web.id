// Adapted from shadcn/ui base-nova Button (MIT); see THIRD_PARTY_NOTICES.md.
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-2 border font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:pointer-events-none',
  { variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85',
      ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
      link: 'border-transparent bg-transparent text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'min-h-10 px-4 py-2 text-sm',
      sm: 'min-h-9 px-3 text-sm',
      lg: 'min-h-11 px-6 text-base',
      'icon-sm': 'size-9 p-0',
    },
  }, defaultVariants: { variant: 'default', size: 'default' } },
);
function Button({ className, variant = 'default', size = 'default', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" data-variant={variant} data-size={size} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
