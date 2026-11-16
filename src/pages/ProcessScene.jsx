export default function ProcessScene({ stage, className = '' }) {
  return (
    <div className={`process-scene ${className}`} style={{ '--stage': stage }} aria-hidden="true">
      <img src="/images/mehchana-bilona-process-compact.png" width="2172" height="724" alt="" loading="lazy" decoding="async" />
    </div>
  );
}
