import { useMotionPreference } from '../lib/use-motion-preference';
import { useState } from 'react';
import { motion } from 'motion/react';

/** Authored, word-based replay specimen; no supplier source or text-splitting plugin. */
export interface SplitTextProps { text: string; className?: string; }
export default function SplitText({ text, className }: SplitTextProps) {
  const [revision, setRevision] = useState(0);
  const reduced = useMotionPreference();
  return <div className="stack"><p className={className} aria-label={text}>
    <span aria-hidden="true" key={revision}>{text.split(' ').map((word, index) => <motion.span key={index}
      style={{ display: 'inline-block', whiteSpace: 'pre' }}
      initial={revision && !reduced ? { y: 8 } : false} animate={{ y: 0 }}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : Math.min(index * 0.04, 0.3) }}>
      {word}{index < text.split(' ').length - 1 ? ' ' : ''}
    </motion.span>)}</span>
  </p><button type="button" className="text-link" onClick={() => setRevision(value => value + 1)}>Replay text</button></div>;
}
