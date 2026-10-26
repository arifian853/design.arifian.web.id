import type { ReactNode } from 'react';
import AnimatedContent from './AnimatedContent';

/** Authored reveal with native scrolling and a readable static baseline. */
export default function ScrollReveal({ children, containerClassName, textClassName }: {
  children: ReactNode; containerClassName?: string; textClassName?: string;
}) {
  return <AnimatedContent className={containerClassName}><div className={textClassName}>{children}</div></AnimatedContent>;
}
