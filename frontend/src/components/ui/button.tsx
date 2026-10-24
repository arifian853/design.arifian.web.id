// Adapted from shadcn/ui base-nova Button (MIT); see THIRD_PARTY_NOTICES.md.
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 border font-medium disabled:opacity-50 disabled:pointer-events-none',
  { variants: { variant: {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border-border bg-background text-foreground hover:bg-card',
  } }, defaultVariants: { variant: 'default' } },
);
function Button({ className, variant = 'default', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, className }))} {...props} />;
}
export { Button, buttonVariants };
