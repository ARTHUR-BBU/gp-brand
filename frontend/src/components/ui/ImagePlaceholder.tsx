interface ImagePlaceholderProps {
  label: string;
  className?: string;
}

export function ImagePlaceholder({ label, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container text-text-secondary/40 font-sans text-sm text-center p-4 ${className}`}
    >
      {label}
    </div>
  );
}
