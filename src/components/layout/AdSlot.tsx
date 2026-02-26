interface AdSlotProps {
  className?: string;
  label?: string;
}

export default function AdSlot({ className = '', label = 'Advertisement' }: AdSlotProps) {
  return (
    <div className={`ad-slot py-6 px-4 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider opacity-60">{label}</span>
    </div>
  );
}
