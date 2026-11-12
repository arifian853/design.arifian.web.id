import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

function BrandSwatch({ step, hex }: { step: string; hex: string }) {
  const [status, setStatus] = useState('');
  const [manualCopy, setManualCopy] = useState(false);

  async function copy() {
    setStatus('Copying…');
    try {
      await navigator.clipboard.writeText(hex);
      setManualCopy(false);
      setStatus(`Copied ${hex}.`);
    } catch {
      setManualCopy(true);
      setStatus('Clipboard unavailable. Select the hex below and copy it manually.');
    }
  }

  return <figure className="brand-swatch-card">
    <div className="color-swatch" style={{ backgroundColor: hex }} aria-hidden="true" />
    <figcaption>
      <div className="brand-swatch-details">
        <div><strong>Brand {step}</strong><code>{hex}</code></div>
        <Button type="button" variant="outline" size="sm" aria-label={`Copy Brand ${step} ${hex}`} onClick={copy}>Copy</Button>
      </div>
      <p className="brand-swatch-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
      {manualCopy && <label className="brand-swatch-manual">
        <span>Brand {step} hex for manual copying</span>
        <Input readOnly value={hex} onFocus={event => event.currentTarget.select()} />
      </label>}
    </figcaption>
  </figure>;
}

export default function BrandSwatches({ colors }: { colors: string[][] }) {
  return <div className="swatch-grid">{colors.map(([step, hex]) => <BrandSwatch key={step} step={step} hex={hex} />)}</div>;
}
