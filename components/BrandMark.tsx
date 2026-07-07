/** The Teckro logo mark: radar ring + green validation check on a dark badge.
 *  Self-contained SVG (fixed colors) so it looks identical in light and dark. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Teckro">
      <rect width="100" height="100" rx="24" fill="#0a0a0a" />
      <circle cx="46" cy="55" r="25" fill="none" stroke="#ffffff" strokeWidth="6" />
      <path
        d="M22 79 L33 68"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M33 56 l10 11 L84 20"
        fill="none"
        stroke="#34d399"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
