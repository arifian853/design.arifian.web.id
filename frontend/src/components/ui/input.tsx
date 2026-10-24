// Adapted from shadcn/ui base-nova Input (MIT); see THIRD_PARTY_NOTICES.md.
import type { ComponentProps } from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@/lib/utils';
function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return <InputPrimitive type={type} data-slot="input" className={cn('w-full min-w-0 disabled:opacity-50', className)} {...props} />;
}
export { Input };
