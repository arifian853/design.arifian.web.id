import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { MotionConfig, motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CinematicHome() {
  const storyRef = useRef<HTMLElement>(null);
  const systemReduced = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionPreference, () => true);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const motionActive = motionOverride ?? systemReduced !== true;
  const reducedMotion = motionOverride === null ? 'user' : motionOverride ? 'never' : 'always';
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  });
  const stageY = useTransform(storyProgress, [0, 0.42, 1], [82, 0, -42]);
  const stageX = useTransform(storyProgress, [0, 0.5, 1], [-30, 0, 26]);
  const stageRotateY = useTransform(storyProgress, [0, 0.5, 1], [-13, 0, 9]);
  const stageRotateX = useTransform(storyProgress, [0, 0.5, 1], [9, 0, -5]);
  const stageScale = useTransform(storyProgress, [0, 0.48, 1], [0.82, 1, 0.9]);

  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <div className="cinematic-home" data-motion={motionActive ? 'active' : 'static'} data-hydrated={hydrated}>
        <motion.div className="cinema-progress" aria-hidden="true" style={{ scaleX: motionActive ? scrollYProgress : 0 }} />
        <a className="cinema-skip" href="#workbench">Skip to the workbench</a>
        <header className="cinema-nav">
          <a className="cinema-wordmark" href="#top" aria-label="Design archive home">D<span>/</span>A</a>
          <nav aria-label="Main navigation">
            <a href="#sequence">The idea</a>
            <a href="#workbench">Workbench</a>
          </nav>
          <Button
            variant="outline"
            className="cinema-motion-toggle"
            aria-pressed={motionActive}
            disabled={!hydrated}
            onClick={() => setMotionOverride(!motionActive)}
          >
            {motionActive ? 'Turn motion off' : 'Turn motion on'}
          </Button>
        </header>

        <section className="cinema-hero" id="top" aria-labelledby="cinema-title">
          <div className="hero-copy">
            <p className="cinema-kicker"><span className="live-mark" aria-hidden="true" />A personal design archive</p>
            <h1 id="cinema-title">See the design<br />before you build it.</h1>
            <p className="hero-deck">A visual library where color, type, shape and motion become something you can explore—not just read about.</p>
            <div className="hero-actions">
              <a className="cinema-cta" href="#workbench">Enter the workbench <span aria-hidden="true">↘</span></a>
              <a className="cinema-text-link" href="#sequence">See how the layers come together</a>
            </div>
            <p className="hero-footnote">A study in complete visual systems.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-halo" />
            <div className="hero-grid" />
            <div className="hero-sheet hero-sheet-back"><span>FORM / FIELD</span><i /></div>
            <div className="hero-sheet hero-sheet-mid"><span>TYPE / SCALE</span><strong>Ag</strong><i /></div>
            <div className="hero-sheet hero-sheet-front"><span>VISUAL<br />LANGUAGE</span><div className="hero-index"><b>01</b><b>02</b><b>03</b></div><i /></div>
            <div className="hero-caption"><span>Proof sheet</span><span>01—03</span></div>
          </div>
          <div className="hero-edge-note" aria-hidden="true">Scroll to reveal</div>
        </section>

        <section
          className="story-reel"
          id="sequence"
          ref={storyRef}
          aria-label="A design system assembled in layers"
        >
          <div className="story-layout">
            <div className="story-copy">
              <p className="cinema-kicker">A system is more than a palette</p>
              <h2>Every choice changes the whole frame.</h2>
              <p>Type sets the voice. Shape sets the pace. Composition tells the eye where to go. The interesting part is how they move together.</p>
              <ol className="story-index">
                <li><span>01</span><span>Character</span><span>Color and type</span></li>
                <li><span>02</span><span>Structure</span><span>Shape and surface</span></li>
                <li><span>03</span><span>Rhythm</span><span>Composition and motion</span></li>
              </ol>
            </div>
            <div className="stage-window" aria-hidden="true">
              <div className="stage-light" aria-hidden="true" />
              <motion.div
                className="archive-stage"
                aria-hidden="true"
                style={motionActive ? { x: stageX, y: stageY, rotateX: stageRotateX, rotateY: stageRotateY, scale: stageScale } : { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
              >
                <div className="archive-plane plane-back"><span>01 / Character</span><div className="type-sample">Aa</div><div className="type-lines"><i /><i /><i /></div></div>
                <div className="archive-plane plane-mid"><span>02 / Structure</span><div className="shape-sample"><i /><i /><i /></div><div className="shape-caption">Surface / edge / depth</div></div>
                <div className="archive-plane plane-front"><span>03 / Rhythm</span><div className="layout-sample"><i /><i /><i /><i /><i /></div><div className="layout-caption">A system comes into focus.</div></div>
              </motion.div>
              <span className="stage-coordinate stage-coordinate-top" aria-hidden="true">A—03</span>
              <span className="stage-coordinate stage-coordinate-bottom" aria-hidden="true">Layer study / 01</span>
            </div>
          </div>
        </section>

        <section className="archive-threshold" aria-labelledby="threshold-title">
          <div><p className="cinema-kicker">The archive is the instrument</p><h2 id="threshold-title">Now, step inside.</h2></div>
          <a className="cinema-cta cinema-cta-light" href="#workbench">Enter the workbench <span aria-hidden="true">↘</span></a>
        </section>
      </div>
    </MotionConfig>
  );
}
